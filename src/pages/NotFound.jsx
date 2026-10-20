import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page">
      <div className="container empty empty--page">
        <h1>This page isn’t on the menu</h1>
        <p>The link may be old or mistyped.</p>
        <Link to="/menu" className="btn btn--primary">
          Go to the menu
        </Link>
      </div>
    </div>
  )
}
