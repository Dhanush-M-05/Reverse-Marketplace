import { Link } from 'react-router-dom'
import { FiTwitter, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi'
import Logo from './Logo'
import './footer.css'

const cols = [
  {
    title: 'Product',
    links: [
      ['How it Works', '/#how'],
      ['Features', '/#features'],
      ['Pricing', '/#pricing'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Careers', '/about'],
      ['Blog', '/about'],
    ],
  },
  {
    title: 'Account',
    links: [
      ['Login', '/login'],
      ['Register', '/register'],
      ['Buyer Dashboard', '/buyer'],
      ['Seller Dashboard', '/seller'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p className="muted mt-16" style={{ maxWidth: 320 }}>
            The reverse marketplace where buyers post requirements and verified sellers compete to win your business.
          </p>
          <div className="footer-social mt-16">
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="footer-col">
            <h5>{c.title}</h5>
            {c.links.map(([label, to]) => (
              <Link key={label} to={to}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Reverse Marketplace. Demo project — frontend only.</span>
        <span>Built with React · Framer Motion · React Icons</span>
      </div>
    </footer>
  )
}
