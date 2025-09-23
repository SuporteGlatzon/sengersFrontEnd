type Status = {
  code: 'neutral' | 'success' | 'warning' | 'danger';
  message: string;
};

export type OpportunityProps = {
  id: number;
  data: any;
  date: string;
  company: string;
  city: {
    title: string;
  };
  title: string;
  state: {
    letter: string;
  };
  salary: string;
  occupation_area: {
    title: string;
  };
  type: {
    title: string;
  };
  full_description: string;
  situation: 'approved' | 'pending' | 'no_approved' | 'expired' | string;
  published_by: {
    id: string;
    image: string;
    name: string;
    city: {
      title: string;
    };
    state: {
      letter: string;
    };
    description: string;
  };
};

export type OpportunityType = {
  id: string;
  company?: string;
  city: {
    id: string;
    value: string;
    label: string;
  };
  phone: string;
  state: {
    id: string;
    value: string;
    label: string;
  };
  title?: string;
  icon: string;
  description: string;
  fullDescription: string;
  status: Status;
  canditades: Person[];
  date: string;
  salary?: string;
  tags: {
    opportunityType: {
      id: string;
      value: string;
      label: string;
    };
    occupationArea: {
      id: string;
      value: string;
      label: string;
    };
  };
  publishedBy: Person;
  isOpportunityActive: boolean;
};

export type Person = {
  id: string;
  image?: any;
  name: string;
  city?: string;
  state?: string;
  description?: string;
  fullDescription?: string;
};

export type PersonProfile = {
  id: string;
  image: any;
  name: string;
  email: string;
  phone: string;
  city: {
    id: string;
    value: string;
    label: string;
  };
  state: {
    id: string;
    value: string;
    label: string;
  };
  description: string;
  full_description: string;
  address: string;
  complement: string;
  link_site: string;
  link_linkedin: string;
  link_twitter: string;
  link_instagram: string;
  educations: Array<AcademicInformation>;
  bannerProfile?: any;
  curriculum: any;
  sengeAssociate: boolean;
};

export type PersonProfileRequest = {
  name: string;
  image: string;
  phone: string;
  description: string;
  full_description: string;
  banner_profile: string;
  senge_associate: boolean;
  curriculum: string;
  state_id: number;
  city_id: number;
  address: string;
  complement: string;
  link_site: string;
  link_instagram: string;
  link_twitter: string;
  link_linkedin: string;
};

export type AcademicInformation = {
  id: string;
  course: string;
  institution: string;
  conclusion_at: string;
  current_situation: string;
  observation?: string;
};

export type AcademicInformationRequest = {
  id?: string;
  course: string;
  institution: string;
  conclusion_at: string;
  current_situation: string;
  observation: string;
};
