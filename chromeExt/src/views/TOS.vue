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
            By using the "Brain in Vat" Chrome extension (hereinafter referred to as "the Extension"), you agree to be bound
            by
            these Terms of Service. If you do not agree to these terms, you must not use the Extension.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">2. Description of Service</h2>
            The Extension is an open-source tool designed to assist users in reading and understanding web pages faster
            through
            interactions with an Artificial Intelligence (AI) system.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">3. Data Storage and Usage</h2>
            - <b>Local Storage</b>: The Extension uses `chrome.storage` to store data locally in your browser. This data is
            essential for the functionality of the Extension and is not shared with any third parties.

            <div class="mb-2"></div>
            - <b>Interaction with OpenAI</b>: During the use of the Extension, some data will be sent to OpenAI to
            facilitate
            the
            AI's responses and insights. Users should be aware that while OpenAI maintains its own strict privacy policies,
            any
            data sent is subject to OpenAI's terms and conditions.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">4. Open Source Nature</h2>
            The Extension is open source, which means that its codebase is freely accessible and can be modified or
            distributed
            by the community. However, any modifications or distributions should respect the license under which the
            Extension
            is released.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">5. User Conduct</h2>
            Users are expected to use the Extension in a respectful and appropriate manner. Misuse of the Extension,
            especially
            in ways that could harm its reputation or functionality, is discouraged.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">6. Updates and Modifications</h2>
            The Extension may receive updates or modifications over time. While the open-source nature of the project allows
            for
            community contributions, users are encouraged to always use the latest official release to ensure optimal
            functionality and security.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">7. Limitation of Liability</h2>
            The Extension is provided "as is" without warranty of any kind, either express or implied. In no event shall the
            developers or contributors be liable for any damages, including but not limited to, direct, indirect,
            incidental, or
            consequential damages, arising out of the use or inability to use the Extension.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">8. Age Requirement</h2>
            By using the "Brain in Vat" Chrome extension, you represent and warrant that you are at least 16 years of age.
            If you are under the age of 16, you may not, under any circumstances or for any reason, use the Extension. We
            may, in our sole discretion, refuse to offer the Extension to any person or entity and change its eligibility
            criteria at any time.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">9. Termination</h2>
            Users can stop using the Extension at any time. The developers also reserve the right to discontinue the
            Extension
            or its services at any given time.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">10. Governing Law and Dispute Resolution</h2>
            Any disputes arising out of the use of the Extension will be governed by the laws of the country and state where
            the
            primary developer resides. Parties agree to seek mediation or arbitration before pursuing any legal action.
        </div>

        <div class="mb-4">
            <h2 class="font-bold">11. Changes to Terms of Service</h2>
            These Terms of Service may be updated periodically. Users will be notified of significant changes, and continued
            use
            of the Extension after such changes will constitute acceptance of the updated terms.
        </div>
    </PageInfo>
</template>
