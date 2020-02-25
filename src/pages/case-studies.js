import '../styles/pages/caseStudies.scss'
import '../lib/graphql/image'

import { Link, graphql } from 'gatsby'
import React, { useEffect } from 'react'

import Img from 'gatsby-image'
import Layout from '../components/layout'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import { Router } from '@reach/router'
import SEO from '../components/seo'
import Swiper from 'swiper'
import { truncate } from '../lib/string'

const CaseStudies = ({ data }) => {
  const {
    BannerSVG,
    quoteMarkSVG,
    placeholderSVG,
    caseStudies,
    caseStudiesWithoutReadMore,
  } = data
  const categoriesOfStudies = [
    ...new Set(
      caseStudies.edges
        .map(({ node }) => node.frontmatter.customerCategory)
        .concat(caseStudiesWithoutReadMore.edges.map(({ node }) => node.name))
    ),
  ]
  const studiesByCategory = categoriesOfStudies.map(c => ({
    category: c.split(' ').join('-'),
    studies: caseStudies.edges
      .filter(({ node }) => node.frontmatter.customerCategory === c)
      .concat(
        caseStudiesWithoutReadMore.edges
          .filter(({ node }) => node.name === c)[0]
          .node.customers.map(customer => ({
            node: {
              frontmatter: {
                customer: customer.name,
                summary: customer.summary,
              },
            },
          }))
      ),
  }))

  useEffect(() => {
    new Swiper('.swiper-container', {
      autoplay: {
        delay: 6000,
      },
      loop: true,
      pagination: {
        el: '.swiper-custom-pagination',
        clickable: true,
        bulletClass: 'bullet',
        bulletActiveClass: 'active',
        renderBullet: () => `<span class="bullet"></span>`,
      },
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
    })
  }, [])

  return (
    <Layout>
      <SEO title="Case Studies" />
      <article className="PingCAP-CaseStudies">
        <div className="top-banner-wrapper">
          <Img
            fluid={BannerSVG.childImageSharp.fluid}
            className="banner"
            alt="banner"
          />
          <div className="titles">
            <h2 className="title is-2">Trusted and verified by</h2>
            <h2 className="title is-2">web-scale application leaders</h2>
          </div>
        </div>
        <div className="container section">
          <div className="title is-5 title-under-banner">
            TiDB delivers the value to the innovators in data industry
          </div>
          <div className="card swiper-container">
            <div className="swiper-wrapper top">
              {caseStudies.edges
                .slice(0, 3)
                .map(({ node }) => node.frontmatter)
                .map(study => (
                  <div key={study.customer} className="swiper-slide">
                    <div className="intro">
                      <div className="subtitle is-7">{study.customer}</div>
                      <div className="summary">
                        {truncate.apply(study.summary, [300, true])}
                      </div>
                      <Link
                        to={`/case-studies/${study.title
                          .replace(/[?%]/g, '')
                          .split(' ')
                          .join('-')}`}
                        className="see-case-study"
                      >
                        See case study
                      </Link>
                    </div>
                    <div className="placeholder" />
                  </div>
                ))}
            </div>
            <div className="fixed-intro">
              <img
                className="quote-mark"
                src={quoteMarkSVG.publicURL}
                alt="quote-mark"
              />
              <div className="title is-6 is-spaced">
                <span className="underline"></span>
                Featured Testimonials
              </div>
            </div>
            <img
              className="fixed-placeholder"
              src={placeholderSVG.publicURL}
              alt="placeholder"
            />
            <div className="bottom">
              <NavigateBefore className="swiper-prev" />
              <div className="swiper-custom-pagination" />
              <NavigateNext className="swiper-next" />
            </div>
          </div>
          <div className="title is-5 title-under-swiper">
            15+ Pegabytes in 300+ Companies
          </div>
          <div className="customer-categories">
            {categoriesOfStudies.map(c => (
              <Link
                key={c}
                to={`/case-studies/${c.split(' ').join('-')}`}
                className="button is-small"
              >
                {c}
              </Link>
            ))}
          </div>
          <Router basepath="/case-studies">
            <Logos key="/" path="/" logos={studiesByCategory[0].studies} />
            {studiesByCategory.map(r => (
              <Logos
                key={r.category}
                path={`/${r.category}`}
                logos={r.studies}
              />
            ))}
          </Router>
        </div>
      </article>
    </Layout>
  )
}

function Logos({ logos }) {
  return (
    <div className="columns is-multiline logos">
      {logos
        .map(({ node }) => node.frontmatter)
        .map(logo => (
          <div key={logo.customer} className="column is-3">
            <div className="detail-card">
              <div className="title is-6">{logo.customer}</div>
              <div
                className={`${logo.customer.replace(/[\d/+/.\s]/g, '-')}-logo`}
              />
              <div className="summary">
                {truncate.apply(logo.summary, [300, true])}
              </div>
              {logo.title && (
                <Link
                  to={`/case-studies/${logo.title
                    .replace(/[?%]/g, '')
                    .split(' ')
                    .join('-')}`}
                  className="read-more"
                >
                  Read more >
                </Link>
              )}
            </div>
            <div className="simple-card">
              <div
                className={`${logo.customer.replace(/[\d/+/.\s]/g, '-')}-logo`}
              />
              <div className="title is-6">{logo.customer}</div>
            </div>
          </div>
        ))}
    </div>
  )
}

export const query = graphql`
  query {
    BannerSVG: file(relativePath: { eq: "case-studies/banner.png" }) {
      ...FluidUncompressed
    }
    quoteMarkSVG: file(relativePath: { eq: "case-studies/quote-mark.svg" }) {
      publicURL
    }
    placeholderSVG: file(relativePath: { eq: "case-studies/placeholder.svg" }) {
      publicURL
    }
    caseStudies: allMarkdownRemark(
      filter: {
        fields: { collection: { eq: "markdown-pages/blogs" } }
        frontmatter: { customer: { ne: null } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          frontmatter {
            title
            customer
            customerCategory
            summary
          }
        }
      }
    }
    caseStudiesWithoutReadMore: allCaseStudiesJson {
      edges {
        node {
          name
          customers {
            name
            summary
          }
        }
      }
    }
  }
`

export default CaseStudies
