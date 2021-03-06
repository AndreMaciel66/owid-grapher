import * as React from "react"
import { observable, action, computed } from "mobx"
import { observer } from "mobx-react"

import { Link } from "./Link"
import { EditorFAQ } from "./EditorFAQ"
import { AdminSidebar } from "./AdminSidebar"
import { AdminAppContext, AdminAppContextType } from "./AdminAppContext"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

@observer
export class AdminLayout extends React.Component<{
    noSidebar?: boolean
    title?: string
    children: any
}> {
    static contextType = AdminAppContext
    context!: AdminAppContextType

    @observable isFAQ: boolean = false
    @observable isSidebar: boolean = false

    @action.bound onToggleFAQ() {
        this.isFAQ = !this.isFAQ
    }

    @action.bound onToggleSidebar() {
        this.isSidebar = !this.isSidebar
    }

    componentDidMount() {
        this.isSidebar = !this.props.noSidebar
        this.componentDidUpdate()
    }

    componentDidUpdate() {
        if (this.props.title)
            document.title = this.props.title + " - owid-admin"
    }

    @computed get environmentSpan() {
        const { admin } = this.context
        if (admin.settings.ENV === "development") {
            return <span className="dev">dev</span>
        } else if (window.location.origin === "https://owid.cloud") {
            return <span className="live">live</span>
        } else {
            return <span className="test">test</span>
        }
    }

    render() {
        const { admin } = this.context
        const { isFAQ, isSidebar, environmentSpan } = this

        return (
            <div className={"AdminLayout" + (isSidebar ? " withSidebar" : "")}>
                {isFAQ && <EditorFAQ onClose={this.onToggleFAQ} />}
                <nav className="navbar navbar-dark bg-dark flex-row navbar-expand-lg">
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={this.onToggleSidebar}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" to="/">
                        owid-admin {environmentSpan}
                    </Link>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/charts/create">
                                <FontAwesomeIcon icon={faPlus} /> New chart
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.onToggleFAQ}>
                                FAQ
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/wp/wp-admin"
                                target="_blank"
                            >
                                Wordpress
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link logout" href="/admin/logout">
                                {admin.username}
                            </a>
                        </li>
                    </ul>
                </nav>
                {isSidebar && <AdminSidebar />}
                {this.props.children}
            </div>
        )
    }
}
