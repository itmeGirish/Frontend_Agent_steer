export interface NavLink {
  /** Link label */
  label: string
  /** Link URL */
  href: string
}

export interface NavbarProps {
  /** Logo text or element */
  logo?: string
  /** Navigation links */
  links?: NavLink[]
}