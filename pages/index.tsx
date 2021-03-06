import Head from 'next/head'
import styles from '../styles/Home.module.css'

import parser from 'fast-xml-parser'

let srcRegex = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

export default function Home({ data = [] }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Wrestling News</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        {data.map((item: any, index) => {

          return <div key={index} className="card glass lg:card-side text-neutral-content mb-8 w-9/12 md:w-6/12">
            <figure className="p-6">
              <img src={item.image} className="rounded-lg shadow-lg h-56 w-56 object-scale-down" />
            </figure>
            <div className="card-body">
              <div className="card-title" dangerouslySetInnerHTML={{ __html: item.title }}  >
              </div>
              <div className="card-actions">
                <a href={item.link} target="_blank" className="btn glass rounded-full">View Source</a>
              </div>
            </div>
          </div>
        })}

      </main>

    </div>
  )
}

export async function getServerSideProps(context) {
  const response = await fetch('https://www.ringsidenews.com/feed/', {
    method: 'GET',
    headers: {
      'Content-type': 'text/xml'
    }
  }).then(response => response.text())

  // .then(data => console.log(data));
  const parsedData = parser.parse(response, {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict",
    // attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    // tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
  });

  const items = parsedData.rss.channel.item.map((itm: any) => {
    let src = itm.description.__cdata.match(srcRegex);
    return {
      ...itm,
      image: src && src[1]
    }
  });
  return {
    props: {
      data: items
    },
  }
}