import React from 'react'
import Link from 'next/link'
import styles from "./MainNav.module.scss";

interface MenuPointProps {
  children: any
  href: string
  func?: () => void
}

const MenuPoint = ({children, href, func}: MenuPointProps) => {
  return (
    <li className={styles.mainNav__link} onClick={func ? func : () => {}}>
      <Link href={href}>{children}</Link>
    </li>
  )
}

export default MenuPoint