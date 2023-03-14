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
    interests: IInterest[];
    hostel: string;
    institute_roles: IInstituteRole[];
    achievements: IAchievement[];
    skills: ISkill[];
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
    offered_achievements: IOfferedAchievement[];
    event_interest: IInterest[];
    interests_id: string[];
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

export interface IInterest {
    id: string;
    title: string;
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
    official_post: boolean;
    body: string;
    body_detail: IBody;
    bodies: IBody[];
    permissions: string[];
    users: string[];
    users_detail: IUserProfile[];
    events: IEvent[];
    priority: number;
    year: string;
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

export interface IInstituteRole {
    id: string;
    name: string;
    permissions: string[];
}

export interface IAchievement {
    id: string;
    title: string;
    description: string;
    admin_note: string;

    hidden: boolean;
    dismissed: boolean;
    verified: boolean;
    isSkill: boolean;
    verified_by: string;

    user: IUserProfile;

    body: string;
    body_detail: IBody;

    event: string;
    event_detail: IEvent;

    offer: string;

}

export interface ISkill {
    id: string;
    title: string;
    dismissed: boolean;
    verified: boolean;
    verified_by: string;

    user: IUserProfile;

}

export interface IOfferedAchievement {
    id: string;
    title: string;
    description: string;
    event: string;
    body: string;
    priority: number;
    secret: string;
    generic: string;
    users: IUserProfile[];
    stat: number;
}

export interface ICommunity {
    id: string;
    name: string;
    body: string;
    followers_count: number;
    about: string;
    logo_image: string;
    cover_image: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    is_user_following: boolean;
    posts: ICommunityPost[];
    roles: IBodyRole[];
    str_id: string;
    featured_posts: ICommunityPost[];

}


export interface ICommunityPost {
    id: string;
    str_id: string;
    thread_rank: number;
    comments: ICommunityPost[];
    content: string;
    comments_count: number;
    image_url: string[];
    posted_by: IUserProfile;
    reactions_count: any;
    time_of_creation: Date;
    time_of_modification: Date;
    user_reaction: number;
    most_liked_comment: ICommunityPost;
    status: number;
    tag_user: IUserProfile[];
    tag_location: ILocation[];
    tag_body: IBody[];
    deleted: boolean;
    interests: IInterest[];
    community: ICommunity;
    parent: string;
    featured: boolean;
    anonymous: boolean;
    has_user_reported: boolean;
    reported_by: IUserProfile[];
}
