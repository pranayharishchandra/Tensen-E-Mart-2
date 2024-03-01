import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'TensenMart',
  description: 'We sell the best products at cheap price',
  keywords: 'electronics, buy electronics, cheap electronics, best electronics',
};

export default Meta;

/**
 * Helmet is used in React applications to manage the document "head". It allows you to "dynamically set" the title, meta tags, and other elements in the head section of your HTML document based on the current state of your React components. This is useful for SEO optimization and managing metadata for each page in your application.

 * 
 */
