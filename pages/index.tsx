import { Button } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  
  return (
    <div>
      <Head>
        <title>spinstone</title>
        <meta name="description" content="its pizza" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Button>dont click me</Button>

      <Link href="/customer">click me instead</Link>

      <footer className={styles.footer}>foot stuff</footer>
    </div>
  );
}
