
import React from 'react';
import Layout from '../components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | Host Africa</title>
        <meta name="description" content="Our terms and conditions for using Host Africa services." />
      </Helmet>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-hosting-dark-gray mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              These Terms of Service (the "Agreement") are an agreement between Atlantic KZN Suidkus Internet Dienste
              Verskaffer cc t/a HostingKZN ("HostingKZN", "us", "our", or the "Company") and you ("User" or "you" or
              "your"). This Agreement sets forth the general terms and conditions of your use of the products and services
              made available by HostingKZN and of the HostingKZN.com website (collectively, the "Services"). By using the
              Services, you agree to be bound by this Agreement. If you do not agree to abide by the terms of this
              Agreement, you are not authorized to use or access the Services.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Additional Policies and Agreements</h2>
            <p>
              Use of the Services is also governed by the following policies, which are incorporated by reference. By using
              the Services, you also agree to the terms of the following policies.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="/privacy" className="text-hosting-orange hover:underline">Privacy Notice</a></li>
            </ul>
            <p>
              Additional terms may also apply to certain Services, and are incorporated by reference herein as applicable.
              For example, if you register a domain name with us, then the Domain Registration Agreement will also apply
              to you and would be incorporated herein.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Account Eligibility</h2>
            <p>
              By registering for or using the Services, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are eighteen (18) years of age or older. The Services are intended solely for Users who are eighteen
                (18) years of age or older. Any registration, use of or access to the Services, by anyone under eighteen
                (18) is unauthorized and is a violation of this Agreement.
              </li>
              <li>
                If you use the Services on behalf of another party you agree that you are authorized to bind such other
                party to this Agreement and to act on such other party's behalf with respect to any actions you take in
                connection with the Services.
              </li>
              <li>
                It is your responsibility to provide accurate, current, and complete information on the registration forms,
                including an email address that is different from the domain you are signing up under. If there is ever an
                abuse issue or we need to contact you, we will use the primary email address we have on file. It is your
                responsibility to ensure that the contact information for your account, including any domain accounts is
                accurate, correct and complete at all times. HostingKZN is not responsible for any lapse in the Services,
                including without limitation, any lapsed domain registrations due to outdated contact information being
                associated with the domain. If you need to verify or change your contact information, you may utilize the
                HostingKZN Billing and Support email to update your contact information. Providing false contact
                information of any kind may result in the termination of your account. Failure to provide the information
                requested may result in your order being denied.
              </li>
              <li>
                You agree to be fully responsible for all use of your account and for any actions that take place through
                your account. It is your responsibility to maintain the confidentiality of your password and other information
                related to the security of your account.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Transfers</h2>
            <p>
              Our Transfers Team will make every effort to help you move your website to us. We do not make any
              guarantees regarding the availability, possibility, or time required to complete an account transfer. Each
              hosting company is configured differently, and some hosting platforms save data in an incompatible or
              proprietary format, which may make it extremely difficult, if not impossible, to migrate some or all account
              data. In some cases we may not be able to assist you in a transfer of data from an old host. In no event shall
              HostingKZN be held liable for any lost or missing data or files resulting from a transfer to or from HostingKZN.
              You are solely responsible for backing up your data in all circumstances.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">HostingKZN Content</h2>
            <p>
              Except for User Content (as defined below), all content made available through the Services, including
              images made available through website builder tools provided by HostingKZN (the "Licensed Images"),
              designs, templates, text, graphics, images, video, information, software, audio and other files, and their
              selection and arrangement, and all software used to provide the Services (collectively with the Licensed
              Images, "HostingKZN Content"), are the property of HostingKZN or its licensors. No HostingKZN Content
              may not be modified, copied, distributed, framed, reproduced, republished, downloaded, scraped, displayed,
              posted, transmitted, sold or exploited for any purpose in any form or by any means, in whole or in part, other
              than as expressly permitted in this Agreement. You may not, directly or indirectly, reverse engineer,
              decompile, disassemble, or otherwise attempt to derive source code or other trade secrets from any
              HostingKZN Content.
            </p>
            <p>
              To the extent applicable, you are granted a limited, revocable, non-sublicensable, license to use the Licensed
              Images solely in connection with the Services. You are prohibited from using any Licensed Images:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                with pornographic, defamatory, or unlawful content or in such a manner that infringes upon any third
                party's trademark or intellectual property rights;
              </li>
              <li>as a trademark, service mark, or logo;</li>
              <li>
                portraying any person depicted therein (a "Model") in a way that a reasonable person would find
                offensive, including but not limited to depicting a Model: (a) in connection with pornography, "adult videos",
                adult entertainment venues, escort services, dating services, or the like; (b) in connection with the
                advertisement or promotion of tobacco products; (c) as endorsing a political party, candidate, elected
                official, or opinion; (d) as suffering from, or medicating for, a physical or mental ailment; or (e) engaging in
                immoral or criminal activities.
              </li>
            </ul>
            <p>
              Any use of HostingKZN Content, other than as specifically authorized herein, is prohibited and will
              automatically terminate your rights to use the Services and any HostingKZN Content. All rights to use
              HostingKZN Content that are not expressly granted in this Agreement are reserved by HostingKZN and
              HostingKZN's licensors.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">User Content</h2>
            <p>
              You may be able to upload, store, publish, display and distribute information, text, photos, videos, emails, and
              other content on or through the Services (collectively, "User Content"). User Content includes any content
              posted by you or by users of any of your websites hosted through the Services ("User Websites"). You are
              solely responsible for any and all User Content and any transactions or other activities conducted on or
              through User Websites. By posting or distributing User Content on or through the Services, you represent and
              warrant to HostingKZN that (i) you have all the necessary rights to post or distribute such User Content, and
              (ii) your posting or distribution of such User Content does not infringe or violate the rights of any third party.
            </p>
            <p>
              Solely for purposes of providing the Services, you hereby grant to HostingKZN a non-exclusive, royalty-free,
              worldwide right and license to: (i) use, reproduce, publicly perform, publicly display, modify, translate, excerpt
              (in whole or in part), publish and distribute User Content; and (ii) make archival or back-up copies of User
              Content and User Websites. Except for the rights expressly granted herein, HostingKZN does not acquire any
              right, title or interest in or to the User Content, all of which shall remain solely with you.
            </p>
            <p>
              HostingKZN exercises no control over, and accepts no responsibility for, User Content or the content of any
              information passing through HostingKZN's computers, network hubs and points of presence or the Internet.
              HostingKZN does not monitor User Content. However, you acknowledge and agree that HostingKZN may, but
              is not obligated to, immediately take any corrective action in HostingKZN's sole discretion, including without
              limitation removal of all or a portion of the User Content or User Websites, and suspend or terminate any and
              all Services without refund if you violate the terms of this Agreement. You hereby agree that HostingKZN shall
              have no liability due to any corrective action that HostingKZN may take.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Compliance with Applicable Law</h2>
            <p>
              You agree to comply with all applicable laws, rules, and regulations, including without limitation all local rules
              where you reside or your organization is location regarding User Content, User Websites, online activities,
              email and your use of the Services. More specifically, but without limitation, you agree to comply with all
              applicable laws regarding the transmission of technical data exported to or from South Africa or the country in
              which you reside. The Services are controlled and operated by us from our offices (although we may share
              data with third parties around the world to assist us in providing the Services as further described in our
              Privacy Notice) and we make no representation that the Services are appropriate or available for use in other
              locations. Those who access the Services from other locations do so at their own initiative and risk, and are
              fully responsible for compliance with all applicable laws in those locations. We do not offer the Services where
              prohibited by law.
            </p>
            <p>
              Applicable national implementing laws in your jurisdiction, and with respect to your subscribers' or customers'
              personal data, you acknowledge and agree that you are the Controller and we are a Processor insofar as you
              may store personal data through your use of our Services only as permitted and subject to the terms of this
              Agreement. You also acknowledge and agree that you are responsible for complying with all obligations of a
              data controller under applicable law.
            </p>
            <p>
              You represent and warrant that in using our Services, you will clearly describe in writing how you plan to use
              any personal data collected and you will ensure you have a legitimate legal basis to transfer such personal
              data to us and that you have the necessary permission to allow us to receive and process (e.g., store) such
              personal data on your behalf.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Third Party Products and Services</h2>
            <p>
              HostingKZN may offer certain third party products and services. Such products and services may be subject
              to the terms and conditions of the third party provider. Discounts, promotions and special third party offers
              may be subject to additional restrictions and limitations by the third party provider. You should confirm the
              terms of any purchase and the use of goods or services with the specific third party provider with whom you
              are dealing.
            </p>
            <p>
              HostingKZN does not make any representations or warranties regarding, and is not liable for, the quality,
              availability, or timeliness of goods or services provided by a third party provider. You undertake all
              transactions with these third party providers at your own risk. We do not warrant the accuracy or
              completeness of any information regarding third party providers. HostingKZN is not an agent, representative,
              trustee or fiduciary of you or the third party provider in any transaction.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">HostingKZN as Reseller or Licensor</h2>
            <p>
              HostingKZN may act as a reseller or licensor of certain third party services, hardware, software and
              equipment used in connection with the Services ("Non-HostingKZN Products"). HostingKZN shall not be
              responsible for any changes in the Services that cause any Non-HostingKZN Products to become obsolete,
              require modification or alteration, or otherwise affect the performance of the Services.
            </p>
            <p>
              Any malfunction or manufacturer's defects of Non-HostingKZN Products, either sold, licensed or provided by
              HostingKZN to you will not be deemed a breach of HostingKZN's obligations under this Agreement. Any rights
              or remedies you may have regarding the ownership, licensing, performance or compliance of any Non-
              HostingKZN Product are limited to those rights extended to you by the manufacturer of such Non-HostingKZN
              Product. You are entitled to use any Non-HostingKZN Product supplied by HostingKZN only in connection
              with your use of the Services as permitted under this Agreement. You shall make no attempt to copy, alter,
              reverse engineer, or tamper with such Non-HostingKZN Product or to use it other than in connection with the
              Services. You shall not resell, transfer, export or re-export any Non-HostingKZN Product, or any technical
              data derived therefrom, in violation of any applicable law, rules or regulations.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Third Party Websites</h2>
            <p>
              The Services may contain links to other websites that are not owned or controlled by HostingKZN ("Third
              Party Sites"), as well as articles, photographs, text, graphics, pictures, designs, sound, video, information,
              and other content or items belonging to or originating from third parties ("Third Party Content"). We are not
              responsible for any Third Party Sites or Third Party Content accessed through the Services. Third Party Sites
              and Third Party Content are not investigated, monitored or checked for accuracy, appropriateness, or
              completeness by us. If you decide to access Third Party Sites or to access or use any Third Party Content,
              you do so at your own risk and you should be aware that our terms and policies no longer govern. You should
              review the applicable third party's terms and policies, including privacy and data gathering practices of any
              website to which you navigate.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Prohibited Persons (Countries, Entities, And Individuals)</h2>
            <p>
              The Services are subject to export control and economic sanctions laws and regulations administered or
              enforced by South African Law. You may not use the Services to export or re-export, or permit the export or
              re-export, of software or technical data in violation of South African Trade Laws. In addition, by using the
              Services, you represent and warrant that you are not (a) an individual, organization or entity organized or
              located in a country or territory that is the target of OFAC sanctions (including Cuba, Iran, Syria, North Korea,
              or the Crimea region of Ukraine); (b) designated as a Specially Designated National or Blocked Person by
              OFAC or otherwise owned, controlled, or acting on behalf of such a person; (c) otherwise a prohibited party
              under South African Trade Laws; or (d) engaged in nuclear, missile, chemical or biological weapons activities
              to which South African persons may not contribute without a South African Government license. Unless
              otherwise provided with explicit written permission, HostingKZN also does not register, and prohibits the use
              of any of our Services in connection with, any Country-Code Top Level Domain Name ("ccTLD") for any
              country or territory that is the target of OFAC sanctions. The obligations under this section shall survive any
              termination or expiration of this Agreement or your use of the Services.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Account Security and HostingKZN Systems</h2>
            <p>
              It is your responsibility to ensure that scripts/programs installed under your account are secure and
              permissions of directories are set properly, regardless of the installation method. When at all possible, set
              permissions on most directories to 755 or as restrictive as possible. Users are ultimately responsible for all
              actions taken under their account. This includes the compromise of credentials such as user name and
              password. You are required to use a secure password. If a weak password is used, your account may be
              suspended until you agree to use a more secure password.
            </p>
            <p>
              The Services, including all related equipment, networks and network devices are provided only for authorized
              customer use. HostingKZN may, but is not obligated to, monitor our systems, including without limitation, to
              ensure that use is authorized, to facilitate protection against unauthorized access, and to verify security
              procedures, survivability, and operational security. During monitoring, information may be examined,
              recorded, copied and used for authorized purposes. By using the Services, you consent to monitoring for
              these purposes.
            </p>
            <p>
              Any account found connecting to a third party network or system without authorization from the third party is
              subject to suspension. Access to networks or systems outside of your direct control requires the express
              written consent of the third party. HostingKZN may, at our discretion, request documentation to prove that
              your access to a third party network or system is authorized.
            </p>
            <p>
              Any account which causes us to receive an abuse report may be terminated and/or have access to services
              suspended. If you do not remove malicious content from your account after being notified by HostingKZN of
              an issue, we reserve the right to leave access to services disabled.
            </p>
            <p>
              You are solely responsible for any applicable compliance with South African or state laws governing the
              privacy and security of personal data, including medical or other sensitive data. You acknowledge that the
              Services may not be appropriate for the storage or control of access to sensitive data, such as information
              about children or medical or health information. HostingKZN does not control or monitor the information or
              data you store on, or transmit through, the Services. We do not sign "Business Associate Agreements" and
              you agree that HostingKZN is not a Business Associate or subcontractor or agent of yours. If you have
              questions about the security of your data, you should contact support@hostingkzn.com.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Compatibility with the Services</h2>
            <p>
              You agree to cooperate fully with HostingKZN in connection with HostingKZN's provision of the Services. It is
              solely your responsibility to provide any equipment or software that may be necessary for your use of the
              Services. To the extent that the performance of any of our obligations under this Agreement may depend
              upon your performance of your obligations, HostingKZN is not responsible for any delays due to your failure
              to timely perform your obligations.
            </p>
            <p>
              You are solely responsible for ensuring that all User Content and User Websites are compatible with the
              hardware and software used by HostingKZN to provide the Services, which may be changed by HostingKZN
              from time to time in our sole discretion.
            </p>
            <p>
              You are solely responsible for backing-up all User Content, including but not limited to, any User Websites.
              HostingKZN does not warrant that we back-up any User Content, and you agree to accept the risk of loss of
              any and all User Content.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Email Policy</h2>
            <h3 className="text-lg font-semibold mt-4">Limits</h3>
            <p>
              There is a 500 outgoing email hourly limit per domain. This limit is also applied towards Mailman. If you send
              over this amount in any hour, most of the e-mails will bounce back with an undeliverable error. If this occurs, it
              will then take some time for your account to be able to send again so we recommend waiting at least 1 hour
              after this issue occurs to begin sending email again.
            </p>
            <p>
              Many of our servers have a limit of 30 POP3/IMAP checks per hour per each user's connecting IP address. If
              you go over this you're likely to get a wrong password error message or an error stating "login incorrect". If
              this occurs, please wait an hour and it will automatically unblock you. To prevent this from happening again,
              please make sure to disable auto checking or at least set it to something higher such as once every 10
              minutes.
            </p>
            <p>
              Any mailing list larger than 5,000 addresses will require a dedicated server or VPS hosting solution from us.
              Note: Dividing one large list into smaller lists to get below this limit is not allowed.
            </p>
            <p>
              There is also a limit to the number of Mailman mailing lists permitted as follows (NOTE: This does not apply to
              other mailing list programs such as PHPList. This only applies to Mailman.)
            </p>

            <h3 className="text-lg font-semibold mt-4">Mailing Lists Rules</h3>
            <p>
              Any time you're sending a message no matter how large your e-mail list is you must throttle it. We
              recommend you throttle it to at the very least sending 1 email every 8 seconds. (Sending 1 every 8 seconds
              would send 450 emails within 1 hour, keeping you below the 500 outgoing email limit.) If the mailing list
              software you're using does not allow you to throttle you must switch to an application or script that will. We
              recommend PHPList, which can be found in your CPanel, under Quickinstall.
            </p>
            <p>
              IMPORTANT: If you do not throttle and you try sending 500 emails, the server will try sending all 500 in 1
              second which is not possible on our shared servers. This will cause a very high load on the server and the
              entire server will be sluggish, potentially affecting your sites and service, until this sending process is
              completed. It is our job to keep the server up and running without being sluggish or experiencing issues.
              Anyone who causes the server's load to go high will be suspended and the process will be terminated. If you
              choose not to throttle, you will most likely be suspended for crashing the server.
            </p>
            <p>
              The list must be a Double Opt-In list. This means a user has subscribed for a newsletter or other email
              marketing messages by explicitly requesting it and confirming the email address to be their own. Confirmation
              is usually done by responding to a notification/confirmation email sent to the email address the end user
              specified. The double opt-in method eliminates the chance of abuse where somebody submits someone
              else's email address without their knowledge and against their will. You will not be permitted to mail any
              mailing list that you were given or purchased. In doing so, this will also be considered spamming and may
              result in termination of the offending account.
            </p>
            <p>
              Email Scripts must be able to handle and document all information from a double opt-in list. This includes
              recording the sign-up IP address and date/time, double opt-in verification IP address and date/time,
              processing opt-outs (via web or email), and list removal on bounce backs. All opt-outs or bounce back
              removals must be handled in a timely manner, and outbound mail must be throttled on shared packages to a
              maximum of five hundred (500) emails per hour. If your account is found to be using a script that does not
              meet these requirements, HostingKZN reserves the right to suspend, terminate, or deactivate your script or
              account.
            </p>
            <p>
              Any unsolicited e-mail being sent will result in suspension or termination of the offending account. We take a
              zero tolerance stance against sending of unsolicited e-mail and other forms of spam.
            </p>
            <p>
              No direct SMTP mailers are allowed. An example of this would be a Darkmailer or The Bat!. Any mail should
              be sent through the local mail server/MTA for further delivery by the server and not done directly by scripts.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Billing and Payment Information</h2>
            <h3 className="text-lg font-semibold mt-4">Prepayment</h3>
            <p>
              It is your responsibility to ensure that your payment information is up to date, and that all invoices are paid on
              time. You agree to pay for the Services in advance of the time period during which such Services are
              provided. Subject to applicable laws, rules, and regulations, payments received will be first applied to the
              oldest outstanding invoice in your billing account.
            </p>

            <h3 className="text-lg font-semibold mt-4">Auto-renewal</h3>
            <p>
              Unless otherwise provided, you agree that until and unless you notify HostingKZN of your desire to cancel the
              Services, you will be billed on an automatically recurring basis to prevent any disruption to your Services,
              using your credit card or other billing information on file with us.
            </p>

            <h3 className="text-lg font-semibold mt-4">Late Payment</h3>
            <p>
              All invoices must be paid within seven (7) days of the invoice due date. Any invoice that is outstanding for
              more than seven (7) days may result in the suspension or termination of Services. Access to the account will
              not be restored until payment has been received. If you fail to pay the fees as specified herein, HostingKZN
              may suspend or terminate your account and pursue the collection costs incurred by HostingKZN, including
              without limitation, any arbitration and legal fees, and reasonable attorneys' fees. HostingKZN will not activate
              new orders or activate new packages for customers who have an outstanding balance on their account.
            </p>

            <h3 className="text-lg font-semibold mt-4">Domain Payments</h3>
            <p>
              Domain renewal notices are provided as a courtesy reminder and HostingKZN is not responsible for a failure
              to renew a domain or a failure to notify a customer about a domain's renewal. Domain renewals are billed and
              renewed fifteen (15) days before the renew date.
            </p>

            <h3 className="text-lg font-semibold mt-4">Fraud</h3>
            <p>
              It is a violation of this Agreement for you to misuse or fraudulently use credit cards, charge cards, electronic
              funds transfers, electronic checks, or any other payment method. HostingKZN may report any such misuse or
              fraudulent use, as determined in HostingKZN's sole discretion, to governmental and law enforcement
              authorities, credit reporting services, financial institutions and/or credit card companies.
            </p>

            <h3 className="text-lg font-semibold mt-4">Invoice Disputes</h3>
            <p>
              You have thirty (30) days to dispute any charge or payment processed by HostingKZN. If you have any
              questions concerning a charge on your account, please reach out to our billing department for assistance.
            </p>

            <h3 className="text-lg font-semibold mt-4">Payment Card Industry Security Standard Disclaimer</h3>
            <p>
              HostingKZN complies with the Payment Card Industry Security Standard ("PCI Standard") in connection with
              the collection and processing of our customer's data and billing information. However, you are solely
              responsible for the security of the data and billing information on your User Website. HostingKZN does not
              monitor User Websites for PCI compliance and we are not able to verify whether a User Website complies
              with the PCI Standard.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Cancellations</h2>
            <p>
              A thirty (30) day cancellation notice via email from the registered email account and owner of the account is
              required to effect cancellation. Once we receive your cancellation form and have confirmed all necessary
              information with you via email, we will inform you in writing (typically email) that your account has been
              cancelled.
            </p>

            <h3 className="text-lg font-semibold mt-4">Refund Eligibility</h3>
            <p>
              Refund eligibility will be handled on a case for case basis and at HostingKZN's sole discretion.
            </p>

            <h3 className="text-lg font-semibold mt-4">Non-refundable Products and Services</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Domain registrations and renewals</li>
              <li>Setup Fees</li>
            </ul>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Termination</h2>
            <p>
              HostingKZN may terminate your access to the Services, in whole or in part, including deletion or confiscation
              of all files, content, and/or domain name registrations, without notice in the event that: (i) you fail to pay any
              fees due hereunder to HostingKZN; (ii) you violate the terms and conditions of this Agreement; (iii) your
              conduct may harm HostingKZN or others, cause HostingKZN or others to incur liability, or disrupt
              HostingKZN's business operations (as determined by HostingKZN in its sole discretion); (iv) you are abusive
              toward HostingKZN's staff in any manner; or (v) for any other lawful reason, including to comply with
              applicable law, or as otherwise specified in this Agreement. In such event, HostingKZN will not refund to you
              any fees paid in advance of such termination, and you shall be obligated to pay all fees and charges accrued
              prior to the effectiveness of such termination.
            </p>
            <p className="font-bold">
              UPON TERMINATION OF THE SERVICES FOR ANY REASON, USER CONTENT, USER WEBSITES, AND
              OTHER DATA WILL BE DELETED.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Permitted CPU</h2>
            <p>
              All use of hosting space provided by HostingKZN is subject to the terms of this Agreement and the
              Acceptable Use Policy.
            </p>
            <p>
              Shared hosting space may only be used for web files, active email and content of User Websites.
            </p>
            <p>
              Shared hosting space may not be used for storage (whether of media, emails, or other data), including, as
              offsite storage of electronic files, email or FTP hosts. HostingKZN expressly reserves the right to review every
              shared account for excessive usage of CPU, disk space and other resources that may be caused by a
              violation of this Agreement or the Acceptable Use Policy. HostingKZN may, in our sole discretion, terminate
              access to the Services, apply additional fees, or remove or delete User Content for those accounts that are
              found to be in violation of HostingKZN's terms and conditions.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Price Change</h2>
            <p>
              HostingKZN reserves the right to change prices or any other charges at any time. We will provide you with at
              least thirty (30) days' notice before charging you with any price change on any annual or longer term plans. It
              is your sole responsibility to periodically review billing information provided by HostingKZN through the
              methods of communication, including notices sent by HostingKZN.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Limitation of Liability</h2>
            <p className="font-bold">
              IN NO EVENT WILL HOSTINGKZN ITS DIRECTORS, EMPLOYEES OR AGENTS BE LIABLE TO YOU OR
              ANY THIRD PERSON FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR
              PUNITIVE DAMAGES, INCLUDING FOR ANY LOST PROFITS OR LOST DATA ARISING FROM YOUR
              USE OF THE SERVICES, OR ANY USER CONTENT, USER WEBSITES OR OTHER MATERIALS
              ACCESSED OR DOWNLOADED THROUGH THE SERVICES, EVEN IF HOSTINGKZN IS AWARE OR HAS
              BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="font-bold">
              NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, HOSTINGKZN'S LIABILITY
              TO YOU, OR ANY PARTY CLAIMING THROUGH YOU, FOR ANY CAUSE WHATSOEVER, AND
              REGARDLESS OF THE FORM OF THE ACTION, IS LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO
              HOSTINGKZN FOR THE SERVICES IN THE THREE (3) MONTHS PRIOR TO THE INITIAL ACTION
              GIVING RISE TO LIABILITY. THIS IS AN AGGREGATE LIMIT. THE EXISTENCE OF MORE THAN ONE
              CLAIM HEREAFTER WILL NOT INCREASE THIS LIMIT.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Indemnification</h2>
            <p>
              You agree to indemnify, defend and hold harmless HostingKZN, our affiliates, and their respective officers,
              directors, employees and agents (each an "Indemnified Party" and, collectively, the "Indemnified Parties")
              from and against any and all claims, damages, losses, liabilities, suits, actions, demands, proceedings
              (whether legal or administrative), and expenses (including, but not limited to, reasonable attorney's fees)
              threatened, asserted, or filed by a third party against any of the Indemnified Parties arising out of or relating to
              (i) your use of the Services, (ii) any breach or violation by you of this Agreement; or (iii) any acts or omissions
              by you. The terms of this section shall survive any termination of this Agreement.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Independent Contractor</h2>
            <p>
              HostingKZN and User are independent contractors and nothing contained in this Agreement places
              HostingKZN and User in the relationship of principal and agent, partners or joint venturers. Neither party has,
              expressly or by implication, or may represent itself as having, any authority to make contracts or enter into
              any agreements in the name of the other party, or to obligate or bind the other party in any manner
              whatsoever.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Disclaimer</h2>
            <p>
              HostingKZN shall not be responsible for any damages your business may suffer. HostingKZN makes no
              warranties of any kind, expressed or implied for the Services. HostingKZN disclaims any warranty of
              merchantability or fitness for a particular purpose, including loss of data resulting from delays, delivery
              failures, wrong deliveries, and any and all service interruptions caused by HostingKZN or our employees.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Backups and Data Loss</h2>
            <p>
              Your use of the Services is at your sole risk. HostingKZN is not responsible for files and/or data residing on
              your account. You agree to take full responsibility for all files and data transferred and to maintain all
              appropriate backup of files and data stored on HostingKZN's servers.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Limited Warranty</h2>
            <p className="font-bold">
              THE SERVICES PROVIDED UNDER THIS AGREEMENT ARE PROVIDED ON AN "AS IS" AND "AS
              AVAILABLE BASIS." EXCEPT AS EXPRESSLY PROVIDED IN THIS SECTION, HOSTINGKZN AND OUR
              AFFILIATES, EMPLOYEES, AGENTS, SUPPLIERS AND LICENSORS DISCLAIM ALL WARRANTIES OF
              ANY KIND, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY OR
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT, FOR THE SERVICES PROVIDED
              HEREUNDER. HOSTINGKZN AND OUR AFFILIATES, EMPLOYEES, AGENTS, SUPPLIERS AND
              LICENSORS MAKE NO REPRESENTATIONS OR WARRANTIES (I) THAT THE SERVICES WILL BE
              UNINTERRUPTED, ERROR FREE OR COMPLETELY SECURE; (II) AS TO THE RESULTS THAT MAY BE
              OBTAINED FROM THE USE OF THE SERVICES; OR (III) AS TO THE ACCURACY, RELIABILITY OR
              CONTENT OF ANY INFORMATION PROVIDED THROUGH THE SERVICES. HOSTINGKZN AND OUR
              AFFILIATES, EMPLOYEES, AGENTS, SUPPLIERS AND LICENSORS ARE NOT LIABLE, AND EXPRESSLY
              DISCLAIMS ANY LIABILITY, FOR THE CONTENT OF ANY DATA TRANSFERRED EITHER TO OR FROM
              USERS OR STORED BY USERS ON OR THROUGH THE SERVICES. THE TERMS OF THIS SECTION
              SHALL SURVIVE ANY TERMINATION OF THIS AGREEMENT.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Disclosure to Law Enforcement</h2>
            <p>
              HostingKZN may disclose User information to law enforcement agencies without further consent or
              notification to the User upon lawful request from such agencies. We cooperate fully with law enforcement
              agencies.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Entire Agreement</h2>
            <p>
              This Agreement, including documents incorporated herein by reference, supersedes all prior discussions,
              negotiations and agreements between the parties with respect to the subject matter hereof, and this
              Agreement constitutes the sole and entire agreement between the parties with respect to the matters covered
              hereby.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Changes to the Agreement or the Services</h2>
            <p>
              HostingKZN may modify, add, or delete portions of this Agreement at any time. If we have made significant
              changes to this Agreement, we will post a notice on the HostingKZN website for at least thirty (30) days after
              the changes are posted and will indicate at the bottom of this Agreement the date of the last revision. Any
              revisions to this Agreement will become effective when posted unless otherwise provided. You agree to any
              modification to this Agreement by continuing to use the Services after the effective date of any such
              modification. HostingKZN reserves the right to modify, change, or discontinue any aspect of the Services at
              any time.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Severability</h2>
            <p>
              If any provision or portion of any provision of this Agreement is found to be illegal, invalid or unenforceable by
              a court of competent jurisdiction, the remaining provisions or portions (unless otherwise specified) thereof
              shall remain in full force and effect.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Waiver</h2>
            <p>
              No failure or delay by you or HostingKZN to exercise any right or remedy hereunder shall operate as a waiver
              thereof, nor shall any single or partial exercise of any right or remedy preclude any other or further exercise of
              any right or remedy. No express waiver of, or assent to, any breach of or default in any term or condition of
              this Agreement by any party hereto shall constitute a waiver of, or an assent to, any succeeding breach of or
              default in the same or any other term or condition hereof.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">Force Majeure</h2>
            <p>
              Neither party is liable for any default or delay in the performance of any of its obligations under this
              Agreement (other than failure to make payments when due) if such default or delay is caused, directly or
              indirectly, by forces beyond such party's reasonable control, including, without limitation, fire, flood, acts of
              God, labour disputes, accidents, acts of war or terrorism, interruptions of transportation or communications,
              supply shortages or the failure of any third party to perform any commitment relative to the production or
              delivery of any equipment or material required for such party to perform its obligations hereunder.
            </p>

            <p className="mt-8 text-sm text-gray-500">This file was last modified: 10 December 2024.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
