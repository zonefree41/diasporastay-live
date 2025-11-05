export default function DSFooter() {
    return (
        <footer id="footer" className="footer mt-auto py-4">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <div>© {new Date().getFullYear()} DiasporaStay</div>
                <div className="small opacity-75">Connecting diaspora travelers with trusted stays.</div>
            </div>
        </footer>
    )
}