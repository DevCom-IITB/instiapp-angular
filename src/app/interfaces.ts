export interface IEnumContainer {
    count: number;
    data: any;
}

export interface IUserProfile {
    id: string;
    name: string;
    profile_pic: string;
    website_url: string;
    events_interested: IEvent[];
    events_going: IEvent[];
    contact_no: string;
    show_contact_no: boolean;
    email: string;
    year: number;
    roll_no: string;
    ldap_id: string;
    contact_number: string;
    about: string;
    followed_bodies: IBody[];
    followed_bodies_id: string[];
    roles: IBodyRole[];
    former_roles: IBodyRole[];
    hostel: string;
    institute_roles: IInstituteRole[];
}

export interface IEvent {
    id: string;
    str_id: string;
    name: string;
    description: string;
    image_url: string;
    website_url: string;
    start_time: Date;
    end_time: Date;
    all_day: boolean;
    venues: ILocation[];
    venue_names: string[];
    venues_str: string;
    bodies: IBody[];
    bodies_id: string[];
    interested: IUserProfile[];
    interested_count: number;
    going_count: number;
    going: IUserProfile[];
    user_ues: number;
    weight: number;
    notify: boolean;
    user_tags: number[];
}

export interface ILocation {
    id: string;
    name: string;
    short_name: string;
    description: string;
    parent: string;
    parent_relation: string;
    group_id: number;
    pixel_x: number;
    pixel_y: number;
    lat: number;
    lng: number;
    reusable: boolean;
}

export interface IBody {
    id: string;
    str_id: string;
    name: string;
    short_description: string;
    description: string;
    image_url: string;
    website_url: string;
    children: IBody[];
    parents: IBody[];
    events: IEvent[];
    followers_count: number;
    roles: IBodyRole[];
    blog_url: string;
    user_follows: boolean;
}

export interface IUserEventStatus {
    id: string;
    event: string;
    user: string;
    status: number;
}

export interface IBodyRole {
    id: string;
    name: string;
    inheritable: boolean;
    body: string;
    body_detail: IBody;
    bodies: IBody[];
    permissions: string[];
    users: string[];
    users_detail: IUserProfile[];
    events: IEvent[];

    editing: boolean;
}

export interface INewsEntry {
    id: string;
    guid: string;
    link: string;
    title: string;
    content: string;
    published: Date;
    body: IBody;
    reactions_count: any[];
    user_reaction: number;
}

export interface IHostel {
    id: string;
    name: string;
    short_name: string;
    long_name: string;
    mess: IMenuEntry[];
}

export interface IMenuEntry {
    id: string;
    day: number;
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
    hostel: string;
}

export interface INotification {
    id: number;
    verb: string;
    unread: boolean;
    actor: any;
    actor_type: string;

    image_url: string;
    title: string;
}

export interface IEventContainer {
    title: string;
    events: IEvent[];
}

export interface IUserTag {
    id: number;
    name: string;
}

export interface IUserTagCategory {
    id: number;
    name: string;
    tags: IUserTag[];
}

export interface IComplaintTagUri {
    id: string;
    tag_uri: string;
}

export interface IComplaintComment {
    id: string;
    time: string;
    text: string;
    commented_by: IUserProfile;
    reported_date: string;
}

export interface IComplaint {
    id: string;
    created_by: IUserProfile;
    description: string;
    suggestions: string;
    location_details: string;
    report_date: string;
    reported_date: string;
    status: string;
    status_color: string;
    latitude: number;
    longitude: number;
    location_description: string;
    tags: IComplaintTagUri;
    users_up_voted: IUserProfile[];
    images: string[];
    comments: IComplaintComment[];
    vote_count: number;
    is_subscribed: number;
    upvoted: boolean;
}

export interface IComplaintPost {
    description: string;
    suggestions: string;
    location_details: string;
    latitude: number;
    longitude: number;
    location_description: string;
    tags: string[];
    images: string[];
}

export interface IPostComment {
    text: string;
}

export interface ICommentDialogData {
    commentId: string;
    comment: string;
  }
export interface IInstituteRole {
    id: string;
    name: string;
    permissions: string[];
}
