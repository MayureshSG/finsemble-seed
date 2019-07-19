/**
 * @property {string} id - Either sent when notification is created to refer to id an external system or if null set to UUID.
 * @property {Date} issuedAt - When the notification occurred.
 * @property {string} type - Type of notification.
 * @property {string} title - Main display title.
 * @property {string} details - Details about the notification mainly for display purposes.
 * @property {string} headerText - Display header.
 * @property {string} headerLogo - Logo to display in header section of a notification. HTML source data URI or URL, or CSS class. Defaults set by type in configuration. 
 * @property {string} contentLogo - Logo to display in content section of a notification.HTML source data URI or URL, or CSS class. Defaults set by type in configuration. 
 * @property {IAction[]} actions - List of actions which can be performed on a notification.
 * @property {number} timeout - How long should the notification appear in the UIs.
 * @property {Map<string, any>} meta - Additional metadata to be pass along with notification, which supports arbitrary metadata fields. For example, a team may decide to include a Source or Channel field in all notifications to support filtering operations, or a Quote or Customer ID field to support grouping of notifications generated by different systems but relating to the same entity (for example for filtering/drill down in the Notification Center).
 * @property {Date} dismissedAt - When notification was dismissed.
 * @property {IPerformedAction[]} actionsHistory - list of actions which have been performed on a notification.
*/
interface INotification {
    id?: string;
    issuedAt: Date;
    type?: string;
    title: string;
    details?: string;
    headerText?: string;
    headerLogo?: string;
    contentLogo?: string;
    actions?: IAction[];
    timeout?: number;
    meta?: Map<string, any>;
    dismissedAt?: Date;
    actionsHistory?: IPerformedAction[];
 }
 
/**
 * @property {string} id - UUID
 * @property {string} buttonText - Text to display on the button UI.
 * @property {string} type - Type of notification.
 * @property {string} component - Component to perform the action on.
 * @property {Map<string, any>} params - Additional params passed along with action. 
 */
interface IAction {
    id: string;
    buttonText: string;
	type: string;
	component?: string;
    params?: object;
}

/**
 * @property {string} dismissed action.
 * @property {string} transmit - finsemble Router.
 * @property {string} spawn - finsemble Launcher.
 */
enum Actions {
    DISMISSED = "DISMISSED",
    TRANSMIT = "TRANSMIT",
    SPAWN = "SPAWN"
} 

/**
 * @property {string} id - UUID.
 * @property {Date} datePerformed - When the action was preforned.
 */
interface IPerformedAction {
    id: string;
    datePerformed: Date;
}

/**
 * @property {string} id - UUID
 * @property {Function(notification:INotification)} onNotification - callback for when a subscribing UI component received a notification.
 */
interface ISubscription {
    id: string;
    onNotification(notification: INotification);
    filters: IFilter[];
}

/**
 * @property {object} name : value - name value pair of filter to match subscriptions on. Most commonly something like {channelName: 'mychannel', source: 'mysource'}
 */
interface IFilter {
    [key: string]: string;
} 

/**
 * @property {object} updated stores when a notification matching a particular filter was last updated.
 * @property {IFilter} filter - Could contain any properties of the notification to match on. EG id, meta.channel, type etc...
 */
interface ILastUpdated {
    filter: IFilter;
    updated: Date;
}

interface INotificationService {
    /**
     * A look up of when a notification matching a filter was last updated.
     * @param {IFilter} filter to check the last updated time of a specific notification "type"
     */
    lastUpdated: ILastUpdated[];
    /**
     * List of all notifications.
     */
    notifications: INotification[];
    /**
     * Creates or updates notifications in Finsemble.
     * @param {INotification[]} notifications from external source to be created or updated in Finsemble.
     */
    notify(notification: INotification[]): void;
    /** 
     * Delete a notification as part of a purge.
     * @param {string} id of a notification 
     * @private
     */
    deleteNotification(id: string): void;
    /** 
	 * Update saveLastUpdated time when incoming notification arrives in Finsemble.
     * @param {Date} lastUpdated when alert was last delivered to Finsemble.
     * @param {INotification} notification a notification that was updated. This notification can then be matched on using a filter to find out when different notifications were last updated.
     * @private
     */
    saveLastUpdatedTime(lastUpdated: Date, notification: INotification): void;
    /** 
     * Update the notification to mark actions preformed.
       @param {INotification[]} notifications to apply action to.
       @param {IAction} action which has been triggered by user.
     */    
    handleAction(notification: INotification[], action: IAction): void;
	/**
	 * When incoming notification arrive, lookup matching subscriptions and call nessesary callbacks on subscription.
	 * @param {INotification[]} Array of INotification objects to broadcast.
     * @private
	 */    
    broadcastNotifications(notification: INotification[]): void;
    /** 
	 * Array of subscriptions for a particular set of filters.
     * @private
     */    
    subscriptions: ISubscription[];
}

interface INotificationClient {
    /** 
     * Subscribe for a set of name/value pair filters. Returns subscriptionId
     * @param {Filter} filter with name value pair used to match on.
     * @param {Function} onNotification called whenever a notification matching a specific filter is received in the NotificationService.
     * @param {Function} onSubscriptionSuccess called when subscription is succesfully created.
     * @param {Function} onSubscriptionFault if there is an error creating the subscription.
     */    
    subscribe(filter: IFilter, onNotification: Function, onSubscriptionSuccess: Function, onSubscriptionFault: Function): string;
    /** 
     * Used to unsubscribe to notifications.
     * @param {string} subscriptionId which was returned when subscription was created.
     */    
    unsubscribe(subscriptionId: string): void;
    /** 
     * @param {Filter} filter to identify which notification to save lastUpdated time for.
     * @returns last updated Date object.
     */
    getLastUpdatedTime(filter?: IFilter): Date;
    /** 
     * Used by UI components that need to display a list of historical notifications.
     * @param {Date} date / time to fetch notifications from.
     * @param {Filter} filter to match to notifications.
     * @returns {INotification[]} array of notifications.
     */
    fetchSnapshot(since: Date, filter: IFilter): INotification[];
	/**
	 * When incoming notification arrive, lookup matching subscriptions and call nessesary callbacks on subscription.
	 * @param {INotification[]} Array of INotification objects to broadcast.
	 */    
    broadcastNotifications(notification: INotification[]): void;
    /**
	 * Creates or updates notifications in Finsemble.
	 * @param {INotification[]} Array of INotification
	 */    
    notify(notification: INotification[]): void;
    /** 
     * Update the notification to mark actions preformed.
       @param {INotification[]} notifications to apply action to.
       @param {IAction} action which has been triggered by user.
     */    
    handleAction(notification: INotification[], action: IAction): void;
}

export { INotification, INotificationService, INotificationClient, IFilter };