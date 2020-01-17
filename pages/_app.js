import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import "@assets/reset.css"
import "@assets/item.css"
export default class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
          />
          <title>next-koa-headline</title>
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}