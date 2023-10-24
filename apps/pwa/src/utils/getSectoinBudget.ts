import { FusionAuthRoles, TrackProps } from '../@types/commons';
import axiosInstance from './axios';

type TGetSectionBudget = {
  id: string;
  role: FusionAuthRoles;
};

export const getSectoinBudget = async (props: TGetSectionBudget): Promise<TrackProps> => {
  let value: TrackProps = {
    id: '-1',
    created_at: '01-01-2023',
    updated_at: '01-01-2023',
    is_deleted: false,
    name: 'test',
    with_consultation: false,
    total_budget: 0,
    total_spending_budget: 0,
    total_reserved_budget: 0,
  };
  try {
    const response = await axiosInstance.get(`tender/track-sections/${props.id}`, {
      headers: { 'x-hasura-role': props.role },
      params: {
        include_relations: 'child_track_section,proposal',
      },
    });
    value = response.data.data;
  } catch (error) {
    console.log({ error });
  } finally {
    return value;
  }
};
