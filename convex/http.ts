import {httpRouter} from "convex/server";
import {httpAction} from "./_generated/server";
import {WebhookEvent} from "@clerk/nextjs/server"
import {api} from "./_generated/api";
import {Webhook} from "svix"

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction( async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhookSecret){
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");

        if(!svix_id || !svix_timestamp || !svix_signature){
            return new Response("Missing Svix headers", {status: 400});
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;
        try{
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as WebhookEvent;
        }catch(error){
            return new Response(`Invalid signature ${error}`, {status: 400});
        }


        if(evt.type === "user.created"){
            const data = evt.data;

            try{
                await ctx.runMutation(api.users.syncUser, {
                name : `${data.first_name || ""}  ${data.last_name || ""}`,
                email: data.email_addresses[0].email_address,
                clerkId: data.id,
                image : data.image_url,
            })
            }catch(error){
                return new Response(`Error syncing user ${error}`, {status: 500});
            }
        }

        return new Response("Webhook processed successfully", {status: 200});
    }),
});

export default http;
