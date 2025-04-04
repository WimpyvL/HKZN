
import React from 'react';
import Layout from '../components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Host Africa</title>
        <meta name="description" content="Our privacy policy explains how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-hosting-dark-gray mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-semibold text-hosting-orange">ABOUT US</h2>
            <p>
              Atlantic KZN Suidkus Internet Dienste Verskaffer cc t/a HostingKZN is a leading provider of online tools for small
              businesses to establish and build their web presence, get found in online search, and connect with customers
              through email marketing, social media, and more.
            </p>
            <p>
              We care about protecting the personal information of our customers and visitors who use our websites, products or
              services (collectively, our "Users"). This privacy notice provides details about how your personal information is
              collected, shared and used by us.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">INFORMATION COVERED BY THIS PRIVACY NOTICE</h2>
            <p>
              This privacy notice, which may also be referred to as a "privacy policy" on some of our websites, covers personal
              information, including any information we collect, use and share from you, as described further below.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">INFORMATION YOU VOLUNTARILY PROVIDE TO US</h2>
            <p>We collect the following information from you when you provide it to us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you provide prior to any registration process, such as your email when you provide it to us;</li>
              <li>Information that you provide during any registration process, including in connection with a co-branded offer (such
              as your name, company name, email address, phone number, billing address, Bank account or credit card
              information, geographic location and industry);</li>
              <li>Information you provide, when you call or email us (for support or otherwise) or when you use our products or
              services;</li>
              <li>Payment information, including debit or credit card data that you provide to us (by way of our Services or
              otherwise) when you purchase some of our products and services.</li>
            </ul>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">HOW WE USE YOUR INFORMATION</h2>
            <p>
              We use the information we collect, both on its own and combined with any other information we collect about you,
              for the following business and commercial purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide the requested Services to you;</li>
              <li>To provide you with useful content;</li>
              <li>To ensure the proper functioning of our Services;</li>
              <li>To offer and improve our Services;</li>
              <li>To provide you with requested information or technical support;</li>
              <li>To facilitate your movement through our website or your use of our Services;</li>
              <li>To diagnose problems with our servers or our Services;</li>
              <li>In connection with our security and compliance programs;</li>
              <li>To administer our websites;</li>
              <li>To communicate with you;</li>
              <li>To assist us in offering you a personalized experience or otherwise tailor our Services to you;</li>
              <li>and as otherwise described in this privacy notice.</li>
            </ul>
            <p>
              Payment information that you provide to us, including debit credit card data, will only be used to facilitate payment
              for the Services.
            </p>
            <p>
              We also use recorded telephone conversations for quality control purposes, to train our employees and for our own
              protection.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">SHARING OF INFORMATION</h2>
            <p>We do not share any information obtained as set out above unless it is for legal reasons or by South African Law.</p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">SHARING WITH THIRD PARTY SERVICE PROVIDERS AND VENDORS</h2>
            <p>
              Occasionally, we enter into contracts with carefully selected third parties to assist us in servicing you (for example,
              providing you with customer service, fraud detection and deterrence or access to advertising assets and providing
              us with information technology and storage services) or to assist us in our own marketing and advertising activities
              (including providing us with analytic information and search engine optimization services). Additional information
              about certain third-party service providers we share personal information with is available here. Our contracts with
              such third parties prohibit them from using any of your personal information for any purpose beyond the purpose for
              which it was shared.
            </p>
            <p>
              If you purchase a product or service from a third party through one of our brands, we will pass your personal
              information to such third party in order for them to fulfil your order.
            </p>
            <p>
              We offer features that allow you to better target who you contact through our products and services. These features
              allow you to optimize your campaigns, segment your lists, and better customize your offerings to your customers.
              In order to do this, we partner with third parties who can provide you with information about your contacts. These
              third parties are prohibited from using this personal data for any purpose beyond that for which it was shared.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">CORPORATE REORGANIZATIONS</h2>
            <p>
              If we are involved in a merger, acquisition, a sale of all or a substantial portion of our assets, or other similar sale
              transaction, your information will be transferred as part of that transaction. We will notify you by email and/or a
              prominent notice on our website of any such transfer and any choices you may have regarding your information.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">LEGAL PROCESS</h2>
            <p>
              If legally required to do so, or if we have a good faith belief that such disclosure is reasonably necessary, we may
              disclose your personal information to courts of law, public authorities (including to meet national security or law
              enforcement requirements), and other relevant third parties, such as internet service providers, to conduct an
              investigation, respond to a third party or law enforcement subpoena or court order, to bring legal action, prevent
              harm to others or pursue other relief when you or a third party are or may be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violating our terms and conditions of use;</li>
              <li>Causing injury or other harm to, or otherwise violating the property or other legal rights, of us, other users, or third
              parties or violating state, local, or other applicable law.</li>
            </ul>
            <p>
              To the extent we are legally permitted to do so, we will notify you in the event that we are required to provide your
              personal information to third parties in connection with a subpoena.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">SECURITY</h2>
            <p>
              The transmission of information via the internet, email or text message is not completely secure. Although we will
              do our best to protect your personal information, we cannot guarantee the security of your information transmitted
              through the Services or over email; any transmission is at your own risk. Once we have received your information,
              we will take appropriate technical and organizational measures to safeguard your personal information against
              loss, unauthorized use, access or modification.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">CHOICE/OPT-OUT</h2>
            <h3 className="text-lg font-medium mt-4">MARKETING COMMUNICATIONS FROM US</h3>
            <h4 className="text-md font-medium mt-2">EMAIL</h4>
            <p>
              You always have the opportunity to opt out of our marketing communications with you or change your preferences
              by following a link in the footer of all non-transactional email messages from us or by emailing us at
              support@hostingkzn.com. Some communications from us are considered transactional or service communications
              (for example, important account notifications and billing information). You agree to receive these transactional and
              service communications as a condition of the Services that we provide to you. You must cancel your accounts for
              all Services, if you do not wish to receive any transactional or service communications from us. To cancel your
              account, please follow the instructions found in the terms of service for the applicable Service. You may still receive
              marketing communications from us even after you cancel your account unless you also opt-out of our marketing
              communications, as described above.
            </p>
            <h4 className="text-md font-medium mt-2">PHONE</h4>
            <p>
              If you do not want to receive marketing calls by phone, you may contact customer support at the brand from which
              you purchased your Services and indicate your preference to us.
            </p>
            <h4 className="text-md font-medium mt-2">COOKIES</h4>
            <p>For information about how to manage and opt out from cookies, please visit our Cookie Notice.</p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">RETENTION OF PERSONAL INFORMATION</h2>
            <p>
              We retain your personal information to provide services to you and as otherwise necessary to comply with our legal
              obligations, resolve disputes, and enforce our agreements. We will retain your personal information for no more
              than seven years following the later of the date on which you terminate your use of the Services, unless we are
              otherwise required by law or regulation to retain your personal information for longer.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">LEGAL BASIS FOR PROCESSING YOUR INFORMATION</h2>
            <p>
              Depending on what information we collect from you and how we collect it, we rely on various grounds for
              processing your information under the GDPR, including the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In order to administer our contractual relationship, including setting up your requested Services, payments,
              renewals and processes;</li>
              <li>Because it is in our legitimate interest to run a successful and efficient business and provide you with the Services
              and other useful content;</li>
              <li>In order to fulfil any legal obligations we may have to collect this information from you; and/or</li>
              <li>Because you have provided your consent for us to do so.</li>
            </ul>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">YOUR RIGHT TO CONTROL HOW YOUR PERSONAL INFORMATION IS USED</h2>
            <p>You have the right to make requests regarding your personal information. You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ask us to update or correct personal information if it is inaccurate;</li>
              <li>Request that we transfer some or all of your personal information to you or a third party (whenever it is technically
              feasible to do so);</li>
              <li>Make choices about receiving marketing communications;</li>
              <li>Withdraw your consent to process your personal information in circumstances where we are relying on your
              consent as our basis for processing.</li>
            </ul>
            <p>To exercise any of your rights, please send an email to support@hostingkzn.com.</p>
            <p>We will require you to verify your identity before responding to any requests to exercise your rights.</p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">THIRD PARTY LINKS AND INFORMATION COLLECTION AND USE BY OUR USERS</h2>
            <p>
              Some of our Services provide links to other websites. Because we do not control the information policies or
              practices of these third party sites, you should review their privacy policies to learn about how they collect and use
              personal information.
            </p>

            <h2 className="text-xl font-semibold text-hosting-orange mt-8">NOTIFICATION OF CHANGES</h2>
            <p>
              We reserve the right to modify this privacy notice at any time, so please review it frequently. If we decide to change
              this privacy notice in any material way, we will notify you here, by email, or by means of a notice on
              www.hostingkzn.com or the product or service you use prior to the change becoming effective. In all cases, your
              continued use of any Services constitutes acceptance to any such changes.
            </p>

            <p className="mt-8 text-sm text-gray-500">Last modified: 10 December 2024</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
