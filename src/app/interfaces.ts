export interface EnumContainer {
    count: number;
    data: any;
}

export interface UserProfile {
    id: string;
    name: string;
    profile_pic: string;
    events_interested: Event[];
    events_going: Event[];
    email: string;
    year: number;
    roll_no: string;
    contact_number: string;
    about: string;
    followed_bodies: Body;
    followed_bodies_id: string[];
}

export interface Event {
    id: string;
    name: string;
    description: string;
    image_url: string;
    start_time: Date;
    end_time: Date;
    all_day: boolean;
    venues: Location[];
    venue_names: string[];
    venues_str: string;
    bodies: Body[];
    bodies_id: string[];
    interested: UserProfile[];
    interested_count: number;
    going_count: number;
    going: UserProfile[];
}

export interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

export interface Body {
    id: string;
    name: string;
    description: string;
    image_url: string;
    children: Body[];
    parents: string[];
    events: Event[];
    followers_count: number;
}

export interface UserEventStatus {
    id: string;
    event: string;
    user: string;
    status: number;
}
