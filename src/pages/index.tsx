import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{ marginLeft: '1rem', color: '#fff', borderColor: '#fff' }}
            to="/docs/api/overview">
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  link: string;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'NetRecon Scanner',
    description:
      'Standalone Android network scanner with ARP discovery, port scanning, service detection, and PDF reporting. Works independently without a probe.',
    link: '/docs/scanner/overview',
    icon: '🔍',
  },
  {
    title: 'NetRecon Probe',
    description:
      'Dedicated hardware appliance running 24/7 on your network. Performs continuous monitoring, IDS, vulnerability scanning, PCAP capture, and more.',
    link: '/docs/getting-started/installation',
    icon: '🖥️',
  },
  {
    title: 'Admin Connect',
    description:
      'Mobile management app for fleet administration. Remote probe control, role-based access, and enterprise enrollment via QR code or manual setup.',
    link: '/docs/admin-connect/overview',
    icon: '📱',
  },
  {
    title: 'CMod',
    description:
      'Network device configuration management via SSH and serial console. Command templates, bulk operations, and real-time terminal access.',
    link: '/docs/cmod/overview',
    icon: '⚙️',
  },
  {
    title: 'IPAM',
    description:
      'IP Address Management with subnet tracking, utilization monitoring, and direct import from scan results. Full CIDR support with conflict detection.',
    link: '/docs/ipam/overview',
    icon: '🌐',
  },
  {
    title: 'Agent Deployment',
    description:
      'Deploy lightweight agents to Windows, macOS, and Linux endpoints. Supports SCCM, Intune, GPO, Jamf, and MDM for enterprise-scale rollout.',
    link: '/docs/agents/overview',
    icon: '🚀',
  },
  {
    title: 'Self-Hosting',
    description:
      'Run the entire NetRecon platform on your own infrastructure. Docker Compose deployment with full data sovereignty and Steel Shield security.',
    link: '/docs/self-hosting/overview',
    icon: '🏢',
  },
  {
    title: 'REST API',
    description:
      'Comprehensive REST API with JWT authentication. Integrate NetRecon data into your existing tools, SIEM, or custom dashboards.',
    link: '/docs/api/overview',
    icon: '🔗',
  },
];

function Feature({ title, description, link, icon }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="feature-card" style={{ height: '100%' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="row" style={{ gap: '1.5rem 0' }}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="NetRecon — Network intelligence platform documentation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section style={{ padding: '2rem 0 4rem', textAlign: 'center' }}>
          <div className="container">
            <Heading as="h2">Need Help?</Heading>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Our support team is here to assist you with installation, configuration,
              and any questions about NetRecon products.
            </p>
            <Link
              className="button button--primary button--lg"
              href="mailto:support@netreconapp.com">
              Contact Support
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
