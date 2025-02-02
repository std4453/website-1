import '../styles/pages/404.scss'

import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'
import { Link } from 'gatsby'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not Found" />
    <div className="PingCAP-404-Page">
      <section className="container">
        <h1>Sorry... 404!</h1>
        <p>
          The page you were looking for appears to have been moved, deleted or
          does not exist. You could go back to where you were or head straight
          to our <Link to="/">home page</Link>
        </p>
      </section>
    </div>
  </Layout>
)

export default NotFoundPage
