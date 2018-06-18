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
    email: string;
    year: number;
    roll_no: string;
    ldap_id: string;
    contact_number: string;
    about: string;
    followed_bodies: IBody[];
    followed_bodies_id: string[];
    roles: IBodyRole[];
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
}

export interface ILocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
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
