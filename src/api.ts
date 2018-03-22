export const API = {
    UserList: 'api/users',
    User: 'api/users/{uuid}',
    UserFollowedEvents: 'api/users/{uuid}/followed_bodies_events',

    Events: 'api/events',
    Event: 'api/events/{uuid}',

    Locations: 'api/locations',

    PostImage: 'api/upload',

    LoggedInUser: 'api/login/get-user',
    Login: 'api/login{?code,redir}',
    Logout: 'api/logout',

};
