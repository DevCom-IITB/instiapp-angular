export const API = {
    User: 'api/users/{uuid}',

    UserMe: 'api/user-me',
    UserMeRoles: 'api/user-me/roles',
    UserMeEventStatus: 'api/user-me/ues/{event}{?status}',

    Events: 'api/events',
    EventsFiltered: 'api/events{?start,end}',
    Event: 'api/events/{uuid}',

    Bodies: 'api/bodies',
    Body: 'api/bodies/{uuid}',
    BodyFollow: 'api/bodies/{uuid}/follow{?action}',

    Locations: 'api/locations{?exclude_group}',
    Location: 'api/locations/{id}',

    PostImage: 'api/upload',

    LoggedInUser: 'api/login/get-user',
    Login: 'api/login{?code,redir}',
    Logout: 'api/logout',

    PlacementBlog: 'api/placement-blog{?from,num,query}',
    TrainingBlog: 'api/training-blog{?from,num,query}',

    NewsFeed: 'api/news{?from,num,body,query}',
    NewsFeedReaction: 'api/user-me/unr/{uuid}{?reaction}',

    Roles: 'api/roles',
    Role: 'api/roles/{uuid}',

    Mess: 'api/mess',

    Search: 'api/search{?query}',

    Notifications: 'api/notifications',
    NotificationRead: 'api/notifications/read/{id}',
    NotificationsAllRead: 'api/notifications/read',
    WebPushSubscribe: 'api/user-me/subscribe-wp',

    UserTags: 'api/user-tags'
};
