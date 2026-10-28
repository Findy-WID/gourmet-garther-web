// Official Gourmet Gather logo files live in /public/brand/.
//   logo.png          green wordmark, for light backgrounds
//   logo-on-dark.png  white wordmark, for dark backgrounds
//   icon-512.png      the "G" icon on its own
export default function Logo({ onDark = false, className = '' }) {
  return (
    <img
      className={`logo ${className}`}
      src={onDark ? '/brand/logo-on-dark.png' : '/brand/logo.png'}
      alt="Gourmet Gather"
      width="602"
      height="168"
    />
  )
}
