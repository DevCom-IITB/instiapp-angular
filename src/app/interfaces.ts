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
    contact_number: string;
    about: string;
    followed_bodies: IBody[];
    followed_bodies_id: string[];
    roles: IBodyRole[];
}

export interface IEvent {
    id: string;
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
    name: string;
    short_description: string;
    description: string;
    image_url: string;
    website_url: string;
    children: IBody[];
    parents: string[];
    events: IEvent[];
    followers_count: number;
    roles: IBodyRole[];
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
    permissions: string[];
    users: string[];
    users_detail: IUserProfile[];
}
