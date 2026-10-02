# SNSF Design Studio setup

The design studio is deliberately disabled until the image provider and media storage are configured. This prevents customers from submitting paid generation requests before the business is ready.

Add these values to the server environment:

```env
DESIGN_STUDIO_ENABLED=true
IMAGE_PROVIDER=cloudflare
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_workers_ai_token
CLOUDFLARE_IMAGE_MODEL=@cf/black-forest-labs/flux-2-klein-4b
OPENAI_IMAGE_API_KEY=your_openai_api_key
DESIGN_IMAGE_MODEL=gpt-image-2.5-sunburst
DESIGN_SITE_URL=https://www.snsteelfabrication.com
DESIGN_WHATSAPP_NUMBER=919776501230
DESIGN_DAILY_USER_LIMIT=5
DESIGN_DAILY_GLOBAL_LIMIT=10
```

Set `IMAGE_PROVIDER=cloudflare` to use Workers AI. The Cloudflare token must have Workers AI read/edit access. The FLUX.2 Klein model accepts up to four reference images; Cloudinary references are automatically requested at 512px or smaller for this provider. Keep `IMAGE_PROVIDER=openai` if you want to use the OpenAI Images API instead. Only configure the provider credentials on the server; never expose either token in the client app.

The existing Cloudinary values are required for material photos and generated previews:

```env
cloudinary_Config_Cloud_Name=...
cloudinary_Config_API_Key=...
cloudinary_Config_API_Secret=...
```

The backend supports both the OpenAI Images API and Cloudflare Workers AI. A catalogue product and an optional fabric reference are sent as separate image inputs, while the server prompt tells the model which reference controls the furniture identity and which controls the upholstery. OpenAI uses the Images edits endpoint; Cloudflare uses the FLUX.2 Klein multipart REST endpoint with `input_image_0` through `input_image_3` references. See the provider documentation for [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation) and [Cloudflare FLUX.2 Klein](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/).

If a saved design fails with an authentication, billing or image-model access message, the provider credentials are present but the selected provider is not ready to generate images. Check the Cloudflare account/token or OpenAI project, confirm the selected model is enabled, and review the provider's usage limits. Do not place either token in the client app or expose it in browser code.

After deployment:

1. Sign in to the admin app.
2. Open **Material Library**.
3. Add verified options with unique codes, for example `FAB-001`, `FOAM-32`, `SS-304`, `PLY-18` and `FIN-BRUSHED`.
4. Upload clear reference swatches for fabrics, finishes and tabletops. Keep hidden construction information in the description; customers see it in their saved specification and the admin enquiry.
5. Generate one test preview for each important category before enabling the feature publicly.
6. Monitor **Design Enquiries**. Confirm dimensions, grade, foam, ply, capacity, availability and price with the customer before production.

The preview is intentionally labelled an AI concept. It is not a manufacturing drawing, certification, load test, colour guarantee or price quote. A completed enquiry stores the image link, the original selections and a private customer contact record. The public share link exposes only the concept and specifications.

The server starts a small MongoDB-backed worker inside the API process. It claims one queued design at a time, survives normal request retries through `requestKey`, and marks interrupted jobs failed after a timeout. For a high-volume rollout, move the same worker loop into a dedicated worker service and keep the API process focused on requests.
