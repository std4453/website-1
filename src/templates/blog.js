import '../styles/templates/blog.scss'

import { graphql } from 'gatsby'
import { Link } from 'gatsby-plugin-intl'
import React, { useEffect, useState } from 'react'

import BlogHeader from '../components/blogHeader'
import BlogTags from '../components/blogTags'
import { Button } from '@seagreenio/react-bulma'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Socials from '../components/socials'
import intersection from 'lodash.intersection'

const Blog = ({ data }) => {
  const { markdownRemark } = data
  const { frontmatter, html, tableOfContents } = markdownRemark
  const category = frontmatter.categories
    ? frontmatter.categories[0]
    : 'No Category'

  const [showProgress, setShowProgress] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [fixedSocials, setFixedSocials] = useState(true)
  const [relatedBlogsRef, setRelatedBlogsRef] = useState(null)

  useEffect(() => {
    const footer = document.querySelector('.footer.PingCAP-Footer')
    const footerHeight = footer.getBoundingClientRect().height

    let isReachFooter = false

    const scrollListener = () => {
      const winScrollHeight = document.documentElement.scrollHeight
      const winClientHeight = document.documentElement.clientHeight
      const winScrollTop = document.documentElement.scrollTop
      const toFooter = winScrollHeight - winClientHeight - footerHeight

      setShowProgress(winScrollTop > 0)

      if (winScrollTop > toFooter && !isReachFooter) {
        setFixedSocials(false)
        isReachFooter = true
      }

      if (winScrollTop < toFooter && isReachFooter) {
        setFixedSocials(true)
        isReachFooter = false
      }

      const height = winScrollHeight - winClientHeight
      const scrolled = ((winScrollTop / height) * 100).toFixed()
      setReadingProgress(scrolled)
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  useEffect(() => {
    setRelatedBlogsRef(
      data.blogs.edges
        .map(edge => edge.node)
        .filter(
          node =>
            intersection(node.frontmatter.tags, frontmatter.tags).length > 0
        )
        .filter(node => node.frontmatter.title !== frontmatter.title)
        .sort(
          (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
        )
        .slice(0, 3)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        description={frontmatter.summary}
        link={[
          {
            rel: 'stylesheet',
            href:
              'https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@3.0.1/github-markdown.css'
          }
        ]}
      />
      <article className="PingCAP-Blog">
        {showProgress && (
          <progress
            className="progress is-primary blog-progress"
            value={readingProgress}
            max="100"
          >
            {readingProgress}
          </progress>
        )}
        <section className="section section-blog">
          <div className="container">
            <div className="columns">
              <div className="column is-7">
                <div className="under-category">
                  <Link to="/blog">Blog</Link>
                  <span> > </span>
                  <Link to={`/blog/category/${category}`}>{category}</Link>
                </div>
                <BlogHeader frontmatter={frontmatter} />
                <div
                  className="markdown-body blog-content"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                <BlogTags tags={frontmatter.tags} />
                <section className="section get-started-with-tidb">
                  <h3 className="title">Ready to get started with TiDB?</h3>
                  <div className="destinations">
                    <Button as="a" className="get-started" outlined rounded>
                      Download TiDB
                    </Button>
                    <Button as="a" outlined rounded>
                      Contact Us
                    </Button>
                  </div>
                </section>
              </div>
              <div className="column is-4 is-offset-1 right-column">
                <div className="toc">
                  <h3 className="title is-6">What's on this page</h3>
                  <div
                    className="toc-content"
                    dangerouslySetInnerHTML={{ __html: tableOfContents }}
                  />
                </div>
                {relatedBlogsRef && (
                  <div className="related-blog">
                    <h3 className="title is-6">Related blog</h3>
                    <div className="blogs">
                      {relatedBlogsRef.map(blog => (
                        <BlogHeader
                          key={blog.frontmatter.title}
                          frontmatter={blog.frontmatter}
                          isTitleLink
                          withIcon={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className="follow-us"
                  style={{ display: fixedSocials ? 'block' : 'none' }}
                >
                  <h3 className="title is-6">Welcome to share this post!</h3>
                  <div className="socials">
                    <Socials type="share" title={frontmatter.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($title: String, $language: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        title
        summary
        date(formatString: "YYYY-MM-DD")
        author
        tags
        categories
      }
      tableOfContents(absolute: false, pathToSlugField: "frontmatter.title")
    }
    blogs: allMarkdownRemark(
      filter: {
        fields: { collection: { eq: "markdown-pages/blogs" } }
        frontmatter: { customer: { eq: null }, locale: { eq: $language } }
      }
      limit: 1000
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            author
            tags
            categories
          }
        }
      }
    }
  }
`

export default Blog
