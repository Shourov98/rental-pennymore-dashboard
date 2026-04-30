import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BeforeListed Privacy Policy",
};

const privacyPolicyText = `BEFORELISTED™ PRIVACY POLICY
Last Updated: April 30, 2026
1. Introduction
BeforeListed™ (“BeforeListed,” “we,” “us,” or “our”) is a real estate marketing and intake website operated by Happy Click Shop LLC d/b/a BeforeListed™, through Tuval Mor, a licensed real estate agent affiliated with Corcoran, to collect renter inquiries in connection with rental searches that may extend beyond publicly advertised listing platforms.
This Privacy Policy explains how we collect, use, disclose, and protect personal information when you use the BeforeListed™ website.
By using the website, you consent to the practices described in this Privacy Policy.

2. Information We Collect
2.1 Information You Provide
When you submit an inquiry or register a profile through the website, we may collect:
Name
Email address
Phone number
Rental preferences (budget, neighborhoods, move-in timing, features, selected search scope, and related criteria)
We do not collect:
government-issued identification
Social Security numbers
financial account information
income documentation

2.2 Information Collected Automatically
We may automatically collect limited technical information, including:
IP address (city-level only)
Browser type
Device type
Pages viewed
Date and time of access
We do not collect precise GPS location data.

2.3 Cookies and Analytics
BeforeListed™ may use cookies and standard analytics tools (such as Google Analytics) to understand website usage and improve performance.
You may disable cookies in your browser settings, though some functionality may be limited.

3. How We Use Your Information
We use your information to:
Allow the representing agent to respond to inquiries
Allow the representing agent to communicate regarding rental searches
Allow the representing agent to contact property owners or managers at your request
Allow the representing agent to contact other licensed real estate professionals to assist with your search, with any such involvement subject to required disclosures
Allow the representing agent to act on behalf of an owner or landlord in connection with a rental opportunity identified through the platform, where applicable and with required disclosures provided to the renter
Send automated email notifications to verify that your rental search remains active, approximately 14 days after your last interaction with the platform, and to notify you of request status changes such as archiving
Improve website functionality
Comply with legal and regulatory obligations
We may use your contact information to send transactional or service-related emails related to your use of the website, as well as occasional promotional communications such as discount codes and rental-related offers. All emails can be stopped at any time by deleting your renter profile.
Monitor and enforce platform integrity, including identifying and acting on email addresses associated with abusive, fraudulent, or disruptive activity, which may result in access restrictions or blocking at the administrator’s discretion.

4. How Information Is Shared
4.1 Licensed Real Estate Professionals
When a renter affirmatively consents through the website submission process, their rental search information may be shared with other participating licensed real estate professionals for the purpose of evaluating whether another professional may be able to assist with their search. The information shared upon consent includes rental search details such as budget range, location preferences, and timing, as well as the renter’s first name and last name initial. No additional personally identifiable information — including full last name, email address, or phone number — is shared at this stage without further disclosure and consent.
If another agent is introduced to actively assist with your search or to contact you, any such involvement will be disclosed to you and required agency disclosures will be provided.
Full contact information (such as full last name, email address, or phone number) is not shared with other agents unless required for active representation and disclosed accordingly. Each agent participating on the platform is subject to a separate agent participation agreement that governs their permitted use of renter data. Agents are not authorized to use renter information for any purpose outside of the rental search facilitated through the platform.
Sharing of renter request information with participating licensed real estate professionals occurs only if the renter affirmatively consents through the website submission process. If consent is not provided, the request remains visible solely to the registered professional. Renters may modify visibility preferences where functionality permits.
We do not publicly post renter information.

4.2 Service Providers
We may share information with trusted service providers who assist with:
website hosting
email delivery
analytics and security
Electronic signature providers used for required agency disclosures.
These providers may use information only to perform services on our behalf.

4.3 Legal Requirements
We may disclose information if required to comply with applicable law, court orders, or lawful governmental requests.

4.4 No Sale of Personal Information
BeforeListed™ does not sell personal information.

5. Data Retention
We retain personal information only as long as reasonably necessary to:
respond to inquiries
provide requested services
maintain records
comply with legal obligations
Information is deleted or anonymized when no longer needed, deletion timelines may vary depending on legal, regulatory, and record-keeping requirements. Archived renter requests are retained in our system for administrative and compliance purposes and are not deleted solely because they have been archived. Email addresses that have been blocked for platform integrity reasons may be retained on a restricted-access list for the purpose of preventing re-registration or further abuse.
6. Your Rights
Depending on your jurisdiction, you may have the right to:
access your personal information
request correction
request deletion
opt out of all communications, including promotional emails, at any time by deleting your profile through the website
You may stop all platform-generated emails at any time by deleting your profile through the website. Deleting your profile deactivates your request, removes you from the active renter queue, and stops all automated and promotional emails, including inactivity reminders, archiving notifications, discount codes, and any other service-related communications. Profile deletion does not affect any separately established agency or fee agreement between you and a licensed real estate professional. To request deletion of your personal data following profile removal, contact privacy@beforelisted.com. We will process your request within a reasonable time, subject to any legal retention obligations.
Requests may be submitted to:
📧 privacy@beforelisted.com
BeforeListed™ operates in compliance with applicable fair housing and anti-discrimination laws.

7. Data Security
We implement reasonable administrative and technical safeguards to protect personal information, including access controls and secure authentication measures.
However, no online system is completely secure, and use of the website is at your own risk.

8. Children’s Privacy
BeforeListed™ is not intended for individuals under 18 years of age.
We do not knowingly collect personal information from minors.

9. Third-Party Links
The website may contain links to third-party websites.
We are not responsible for the privacy practices of those sites.

10. Changes to This Privacy Policy
We may update this Privacy Policy from time to time.
Updates will be reflected by a revised “Last Updated” date. In the event of material changes to this Privacy Policy, we will endeavor to notify you by email to the address on file or by posting a prominent notice on the website prior to the changes taking effect. Your continued use of the website following notice of material changes constitutes your acceptance of the revised Privacy Policy.

11. Governing Law
This Privacy Policy is governed by the laws of the State of New York.

12. Contact
For privacy-related questions:
📧 privacy@beforelisted.com
📧 support@beforelisted.com`;

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-10 text-neutral-900 sm:px-8 lg:py-14">
      <article className="mx-auto max-w-4xl whitespace-pre-wrap text-base leading-7">
        {privacyPolicyText}
      </article>
    </main>
  );
}
