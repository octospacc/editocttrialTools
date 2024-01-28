import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Just as Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus-Static is just a set of independent postprocessing and runtime scripts,
        that can complement an existing standard Docusaurus site.
        Just 1 instantaneous build step and a couple of static files
        will make you achieve maximum web compatibility.
      </>
    ),
  },
  {
    title: 'Focus on What Matters, for Real',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        You focus on your content, Docusaurus takes care of all the rendering chores,
        and Docusaurus-Static makes the website work good in all serverless situations.
        Go ahead and move your docs into the <code>docs</code> directory, or start writing in <code>blog</code>.
      </>
    ),
  },
  {
    title: 'Powered, not enslaved, by React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Docusaurus-Static keeps the full functionality of Docusaurus available for server deployments,
        letting you extend or customize your website layout by reusing React,
        while allowing basic functionality to still work without any heavy framework.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
