import test from "node:test";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import verificationEmail from "../utils/EmailTemplates/verifyEmailTemplate.js";
import verificationAdminEmail from "../utils/EmailTemplates/verifyAdminEmailTemplate.js";
import forgotPasswordEmail from "../utils/EmailTemplates/forgotPasswordTemplate.js";
import passwordResetSuccessEmail from "../utils/EmailTemplates/passwordResetSuccessEmail.js";
import welcomeEmail from "../utils/EmailTemplates/welcomeEmailTemplate.js";
import { newLoginEmail, newGoogleLoginEmail } from "../utils/EmailTemplates/loginTemplate.js";
import orderConfirmationEmail from "../utils/EmailTemplates/orderConfirmed.js";
import orderCancelledEmail from "../utils/EmailTemplates/orderCanceledEmail.js";
import orderDeliveredEmail from "../utils/EmailTemplates/orderDeliveredEmail.js";
import orderReturnedEmail from "../utils/EmailTemplates/orderReturnedEmail.js";
import refundCompletedEmail from "../utils/EmailTemplates/orderRefundedEmail.js";
import paymentSuccessEmail from "../utils/EmailTemplates/paymentSuccessEmail .js";
import recommendedProductsTemplate from "../utils/EmailTemplates/recommendedProductsEmail.js";
import promotionalTemplate from "../utils/EmailTemplates/prommotionalEmail.js";

test("every email has the shared brand header, footer, and lightweight logo", () => {
  const templates = [
    verificationEmail(), verificationAdminEmail(), forgotPasswordEmail(),
    passwordResetSuccessEmail(), welcomeEmail(), newLoginEmail(), newGoogleLoginEmail(),
    orderConfirmationEmail(), orderCancelledEmail(), orderDeliveredEmail(),
    orderReturnedEmail(), refundCompletedEmail(), paymentSuccessEmail(),
    recommendedProductsTemplate(), promotionalTemplate("Customer", "Offer", "Hello", false),
  ];

  for (const html of templates) {
    assert.match(html, /^<!doctype html>/i);
    assert.equal((html.match(/images\/email-logo\.png/g) || []).length, 1);
    assert.match(html, /https:\/\/www\.snsteelfabrication\.com\/images\/email-logo\.png/);
    assert.equal((html.match(/New Burupada/g) || []).length, 1);
    assert.equal((html.match(/support@snsteelfabrication\.com/g) || []).length, 2);
    assert.doesNotMatch(html, /images\/logo\.png/);
    assert.match(html, /<\/html>$/);
  }
});

test("campaign body accepts HTML images while plain text and headings are escaped", () => {
  const image = '<img src="https://example.com/promo.jpg" alt="Offer">';
  const html = promotionalTemplate("Jaya & Co", "<Autumn sale>", image, true);
  assert.match(html, /Hello <strong>Jaya &amp; Co<\/strong>/);
  assert.match(html, /&lt;Autumn sale&gt;/);
  assert.match(html, /<img src="https:\/\/example\.com\/promo\.jpg" alt="Offer">/);
  assert.equal((html.match(/New Burupada/g) || []).length, 1);

  const plain = promotionalTemplate("Customer", "News", "<script>alert(1)</script>\nNext line", false);
  assert.doesNotMatch(plain, /<script>/);
  assert.match(plain, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Next line/);
});

test("transactional details and product links survive the shared layout", () => {
  assert.match(verificationEmail("A & B", "481592"), /481592/);
  assert.match(forgotPasswordEmail("Customer", "902314"), /902314/);
  assert.match(newLoginEmail("Customer", "2 Oct 2026, 10:00"), /2 Oct 2026, 10:00/);
  assert.match(newLoginEmail(), /snsteelfabrication\.com\/address/);

  const order = orderConfirmationEmail("Customer", "ORD-42", "₹1,250", "Monday");
  assert.match(order, /ORD-42/);
  assert.match(order, /₹1,250/);
  assert.match(order, /Monday/);
  assert.match(orderCancelledEmail("Customer", "ORD-42", "Refund pending"), /Refund pending/);
  assert.match(orderDeliveredEmail("Customer", "ORD-42", "Monday", "<b>Chair</b>"), /<b>Chair<\/b>/);
  assert.match(orderReturnedEmail("Customer", "ORD-42", "Tuesday", "<b>Chair</b>"), /<b>Chair<\/b>/);
  assert.match(refundCompletedEmail("Customer", "ORD-42", "₹1,250", "UPI", "Wednesday"), /UPI/);
  assert.match(paymentSuccessEmail("Customer", "ORD-42", "₹1,250", "Card", "<li>Chair</li>"), /<li>Chair<\/li>/);

  const products = recommendedProductsTemplate("Customer", "Our picks", [
    { name: "Steel chair", slug: "steel-chair", images: ["https://example.com/chair.jpg"] },
  ]);
  assert.match(products, /snsteelfabrication\.com\/product\/steel-chair/);
  assert.match(products, /https:\/\/example\.com\/chair\.jpg/);
});

test("email logo is substantially smaller than the storefront source", async () => {
  const source = fileURLToPath(new URL("../../client/public/images/logo.png", import.meta.url));
  const email = fileURLToPath(new URL("../../client/public/images/email-logo.png", import.meta.url));
  const [sourceStat, emailStat] = await Promise.all([stat(source), stat(email)]);
  assert.ok(emailStat.size < 30_000);
  assert.ok(emailStat.size < sourceStat.size / 20);
});
