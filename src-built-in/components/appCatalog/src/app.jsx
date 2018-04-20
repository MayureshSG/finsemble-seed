/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/

import React from "react";
import ReactDOM from "react-dom";
//Finsemble font-icons, general styling, and specific styling.
import "../../assets/css/finfont.css";
import "../../assets/css/finsemble.css";
import "../appCatalog.css";
import ComplexMenu from "../../complexMenu/ComplexMenu";
import AppContent from "./components/AppContent";


/**
 * This is our application launcher. It is opened from a button in our sample toolbar, and it handles the launching of finsemble components.
 *
 * @class AppLauncher
 * @extends {React.Component}
 */
class AppCatalog extends React.Component {
	constructor(props) {
		super(props);
		this.finWindow = fin.desktop.Window.getCurrent();
		this.state = { loaded: false }
	}
	componentWillMount() {
		FSBL.Clients.ConfigClient.getValues(null, (err, config) => {
			debugger;
			if (config.startup_app && config.startup_app.applicationIcon) {
				console.log("config.startup_app.applicationIcon", config.startup_app.applicationIcon)
				this.setState({
					loaded: true,
					headerImgUrl: config.startup_app.applicationIcon
				})
			}
		})
		this.setState({ activeSection: this.props && this.props.activeSection ? this.props.activeSection : '' })//Props did not exist in the contructor
	}
	render() {
		var self = this;
		if (!this.state.loaded) return null;
		return (
			<ComplexMenu headerImgUrl={this.state.headerImgUrl} title="App Catalog" activeSection="Apps" navOptions={[{
				label: "Apps",
				content: <AppContent installed={true} />
			}]} />
		);
	}
}

fin.desktop.main(function () {
	FSBL.addEventListener("onReady", function () {
		console.log("App Catalog app onReady");
		FSBL.Clients.WindowClient.finsembleWindow.updateOptions({ alwaysOnTop: true });
		FSBL.Clients.DialogManager.showModal();
		//FSBL.Clients.WindowClient.finsembleWindow.addEventListener("shown", FSBL.Clients.DialogManager.showModal);

		ReactDOM.render(
			<AppCatalog />
			, document.getElementById("bodyHere"));
	});
});