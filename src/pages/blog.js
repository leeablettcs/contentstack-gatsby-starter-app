import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import RenderComponents from "../components/RenderComponents"
import ArchiveRelative from "../components/ArchiveRelative"
import { onEntryChange } from "../live-preview-sdk/index"
import { getPageRes, jsonToHtmlParse } from "../helper"
import BlogList from "../components/BlogList"

const Blog = ({ data: { allContentstackBlogPost, contentstackPage } }) => {
  jsonToHtmlParse(allContentstackBlogPost.nodes)
  const [getBanner, setBanner] = useState(contentstackPage)

  async function fetchData() {
    try {
      const banner = await getPageRes("/blog")
      if (!banner) throw new Error("Error 404")
      setBanner(banner)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData())
  }, [contentstackPage])

  const newBlogList = []
  const newArchivedList = []
  allContentstackBlogPost.nodes?.forEach(post => {
    if (post.is_archived) {
      newArchivedList.push(post)
    } else {
      newBlogList.push(post)
    }
  })
  return (
    <Layout blogPost={allContentstackBlogPost.nodes} banner={contentstackPage}>
      <SEO title={contentstackPage.title} />
      <RenderComponents
        components={getBanner.page_components}
        blogPage
        contentTypeUid="page"
        entryUid={getBanner.uid}
        locale={getBanner.locale}
      />
      <div className="blog-container">
        <div className="blog-column-left">
          {newBlogList?.map((blog, index) => {
            return <BlogList blogList={blog} key={index} />
          })}
        </div>
        <div className="blog-column-right">
          <h2>{contentstackPage.page_components[1].widget.title_h2}</h2>
          <ArchiveRelative data={newArchivedList} />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    contentstackPage(url: { eq: "/blog" }) {
      title
      url
      uid
      locale
      seo {
        enable_search_indexing
        keywords
        meta_description
        meta_title
      }
      page_components {
        contact_details {
          address
          email
          phone
        }
        from_blog {
          title_h2
          featured_blogs {
            title
            uid
            url
            is_archived
            featured_image {
              url
              uid
            }
            body
            author {
              title
              uid
              bio
            }
          }
          view_articles {
            title
            href
          }
        }
        hero_banner {
          banner_description
          banner_title
          bg_color
          call_to_action {
            title
            href
          }
        }
        our_team {
          title_h2
          description
          employees {
            name
            designation
            image {
              url
              uid
            }
          }
        }
        section {
          title_h2
          description
          image {
            url
            uid
          }
          image_alignment
          call_to_action {
            title
            href
          }
        }
        section_with_buckets {
          title_h2
          description
          buckets {
            title_h3
            description
            icon {
              url
              uid
            }
            call_to_action {
              title
              href
            }
          }
        }
        section_with_cards {
          cards {
            title_h3
            description
            call_to_action {
              title
              href
            }
          }
        }
        widget {
          title_h2
          type
        }
      }
    }

    allContentstackBlogPost {
      nodes {
        url
        title
        uid
        author {
          title
          uid
        }
        related_post {
          title
          body
          uid
        }
        date
        featured_image {
          url
          uid
        }
        is_archived
        body
      }
    }
  }
`

export default Blog
