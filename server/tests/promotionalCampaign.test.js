import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canSendPromotionalEmailToUsers,
  outboundEmailRecipients,
  PROMOTIONAL_TEST_EMAIL,
  uniqueCampaignUsers,
} from "../utils/promotionalEmailPolicy.js";
import { deliverPromotionalCampaign } from "../services/promotionalCampaign.service.js";
import { campaignAdmin } from "../middlewares/campaignAdmin.js";
import AdminModel from "../models/admin.model.js";
import { sendEmail, sendEmailBatch } from "../config/emailService.js";

const productionOrigin = "https://admin.snsteelfabrication.com";

test("only the exact production admin origin can target users", () => {
  assert.equal(canSendPromotionalEmailToUsers(productionOrigin, "production"), true);
  for (const origin of [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://admin.snsteelfabrication.com.evil.example",
    "http://admin.snsteelfabrication.com",
    "https://ADMIN.snsteelfabrication.com",
    undefined,
  ]) {
    assert.equal(canSendPromotionalEmailToUsers(origin, "production"), false);
  }
  assert.equal(canSendPromotionalEmailToUsers(productionOrigin, "development"), false);
  assert.equal(outboundEmailRecipients("customer@example.com", "development"), PROMOTIONAL_TEST_EMAIL);
  assert.equal(outboundEmailRecipients("customer@example.com", "production"), "customer@example.com");
});

test("the real email transport redirects a local send before calling Resend", async (t) => {
  const oldEnv = process.env.NODE_ENV;
  const oldKey = process.env.RESEND_API_KEY;
  process.env.NODE_ENV = "development";
  process.env.RESEND_API_KEY = "re_test_placeholder";
  const payloads = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    payloads.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ id: "test-email-id" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  try {
    const result = await sendEmail("customer@example.com", "Hello", "Preview", "");
    assert.equal(result.success, true);
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].to, PROMOTIONAL_TEST_EMAIL);
  } finally {
    if (oldEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldEnv;
    if (oldKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = oldKey;
  }
});

test("bulk transport is disabled locally and counts production batch acceptance", async (t) => {
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";
  const messages = [{ to: "customer@example.com", subject: "Sale", html: "<p>Hello</p>" }];
  const local = await sendEmailBatch(messages);
  assert.equal(local.success, false);
  assert.equal(local.sentCount, 0);

  const payloads = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    payloads.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ data: [{ id: "accepted-id" }] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  try {
    process.env.NODE_ENV = "production";
    const production = await sendEmailBatch(messages);
    assert.equal(production.success, true);
    assert.equal(production.sentCount, 1);
    assert.equal(payloads.length, 1);
    assert.deepEqual(payloads[0][0].to, "customer@example.com");
  } finally {
    if (oldEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldEnv;
  }
});

test("localhost campaign sends exactly one preview to the test inbox", async () => {
  const sent = [];
  const result = await deliverPromotionalCampaign({
    users: [{ name: "One", email: "one@example.com" }, { name: "Two", email: "two@example.com" }],
    subject: "Sale",
    content: "Hello",
    isHtml: false,
    testMode: true,
    render: () => "<p>Preview</p>",
    sendOne: async (...args) => { sent.push(args); return true; },
    sendBatch: () => { throw new Error("bulk send must not run in preview mode"); },
  });
  assert.equal(result.testMode, true);
  assert.equal(result.sentCount, 1);
  assert.equal(result.recipientCount, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0][0], PROMOTIONAL_TEST_EMAIL);
  assert.equal(sent[0][1], "[Preview] Sale");
});

test("production campaign deduplicates recipients and reports provider failures", async () => {
  const batches = [];
  const users = uniqueCampaignUsers([
    { name: "One", email: "one@example.com" },
    { name: "Duplicate", email: "ONE@example.com" },
    { name: "Bad", email: "invalid" },
    { name: "Two", email: "two@example.com" },
  ]);
  assert.equal(users.length, 2);

  const result = await deliverPromotionalCampaign({
    users,
    subject: "Sale",
    content: "<p>Offer</p>",
    isHtml: true,
    testMode: false,
    render: (name) => `<p>${name}</p>`,
    sendBatch: async (batch) => {
      batches.push(batch);
      return { success: false, sentCount: 0, error: "provider failure" };
    },
  });
  assert.equal(result.success, false);
  assert.equal(result.sentCount, 0);
  assert.equal(result.failedCount, 2);
  assert.deepEqual(batches[0].map(({ to }) => to), ["one@example.com", "two@example.com"]);
  assert.deepEqual(batches[0].map(({ html }) => html), ["<p>One</p>", "<p>Two</p>"]);
});

test("customer identity cannot access campaign admin routes", async (t) => {
  t.mock.method(AdminModel, "findById", () => ({
    select: () => ({ lean: async () => null }),
  }));
  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  let advanced = false;
  await campaignAdmin({ adminId: "507f1f77bcf86cd799439011" }, response, () => { advanced = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(advanced, false);
});
