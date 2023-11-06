<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import PageInfo from "../components/PageInfo.vue"
</script>
<template>
    <PageTitle title="Term of Service" :page-name="PageName.PANEL" />
    <PageInfo>
        <div class="mb-4">
            <h2 class="font-bold">1. Acceptance of Terms</h2>
            By accessing and using the "Brain In Vat" Chrome extension (the "Service"), you agree to be bound by these Terms
            of Service ("ToS"). If you disagree with any part of the terms, you do not have permission to access the
            Service.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">2. Age Restriction</h2>
            The Service is intended for individuals aged 13 and older. If you are under 13, you are not permitted to use the
            Service or provide any personal information.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">3. Description of Service</h2>
            "Brain In Vat" is a Chrome extension that uses Retrieval-Augmented Generation and AI to process the content of
            web pages viewed by the user and to provide information and answer questions based on that content.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">4. Privacy</h2>
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these ToS by
            reference.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">5. Open Source</h2>
            "Brain In Vat" is an open-source project. By using this Service, you acknowledge that the source code is
            available and that you are permitted to use, modify, and distribute it in accordance with the license terms
            under which it is distributed.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">6. Data Use and Storage</h2>
            The Service processes and stores data within your browser. Some data may be transmitted to OpenAI during
            interaction with the Service to facilitate the chat functionality. Data sent to OpenAI is subject to OpenAI's
            privacy practices and policies.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">7. Changes to Terms</h2>
            We reserve the right to modify or replace these ToS at any time at our sole discretion. It is your
            responsibility to review these ToS periodically for changes.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">8. User Conduct</h2>
            You agree not to use the Service to:
            <ul>
                <li>Violate any laws or regulations.</li>
                <li>Violate the privacy of others.</li>
                <li>Infringe the intellectual property rights of others.</li>
                <li>Transmit viruses or other malicious code.</li>
            </ul>
        </div>

        <div class="mb-4">
            <h2 class="font-bold">9. Intellectual Property</h2>
            The Service and its original content, features, and functionality are and will remain the exclusive property of
            "Brain In Vat" and its licensors, except where otherwise stated in open-source licensing.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">10. Termination</h2>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the ToS.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">11. Governing Law</h2>
            These ToS shall be governed and construed in accordance with the laws of the United States, without regard to
            its conflict of law provisions.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">12. Contact Us</h2>
            If you have any questions about these ToS, please contact us at jinx@criptext.com.
        </div>
    </PageInfo>
</template>
