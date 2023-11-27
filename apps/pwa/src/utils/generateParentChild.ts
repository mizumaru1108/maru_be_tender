import { SectionSupervisor, TrackSection } from '../@types/commons';
import { ComboBoxOption } from '../components/hook-form/RHFComboBox';

interface IPropSelectedData {
  parent: TrackSection[];
  section_id?: string | null;
}

export default function selectDataById({ parent, section_id }: IPropSelectedData) {
  let tempLvlOne: TrackSection[] = [];
  let tempLvlTwo: TrackSection[] = [];
  let tempLvlThree: TrackSection[] = [];
  let tempLvlFour: TrackSection[] = [];

  const findLvlOne = parent.find((el) => el.id === section_id);

  if (!findLvlOne) {
    for (const childLvlOne of parent) {
      if (childLvlOne.child_track_section && childLvlOne.child_track_section.length) {
        const findLvlTwo = childLvlOne.child_track_section.find((vv) => vv.id === section_id);

        if (!findLvlTwo) {
          for (const childLvlTwo of childLvlOne.child_track_section) {
            if (childLvlTwo.child_track_section && childLvlTwo.child_track_section.length) {
              const findLvlThree = childLvlTwo.child_track_section.find(
                (vvv) => vvv.id === section_id
              );

              if (!findLvlThree) {
                for (const childLvlThree of childLvlTwo.child_track_section) {
                  if (
                    childLvlThree.child_track_section &&
                    childLvlThree.child_track_section.length
                  ) {
                    const findLvlFour = childLvlThree.child_track_section.find(
                      (vvvv) => vvvv.id === section_id
                    );

                    if (findLvlFour) {
                      tempLvlFour.push({ ...findLvlFour });
                      tempLvlThree.push({ ...childLvlThree });
                      tempLvlTwo.push({ ...childLvlTwo });
                      tempLvlOne.push({ ...childLvlOne });
                    }
                  }
                }
              } else {
                tempLvlThree.push({ ...findLvlThree });
                tempLvlTwo.push({ ...childLvlTwo });
                tempLvlOne.push({ ...childLvlOne });
                tempLvlFour = findLvlThree.child_track_section ?? [];
              }
            }
          }
        } else {
          tempLvlTwo.push({ ...findLvlTwo });
          tempLvlOne.push({ ...childLvlOne });
          tempLvlThree = findLvlTwo.child_track_section ?? [];
        }
      }
    }
  } else {
    tempLvlOne = [{ ...findLvlOne }];
    tempLvlTwo = findLvlOne.child_track_section ?? [];
  }

  return { tempLvlOne, tempLvlTwo, tempLvlThree, tempLvlFour };
}

export function selectSectionProjectPath({ parent, section_id }: IPropSelectedData) {
  let levelOne: TrackSection | null = null;
  let levelTwo: TrackSection | null = null;
  let levelThree: TrackSection | null = null;
  let levelFour: TrackSection | null = null;

  const findLevelOne = parent.find((el) => el.id === section_id);

  if (!findLevelOne) {
    for (const childLvlOne of parent) {
      if (childLvlOne.child_track_section && childLvlOne.child_track_section.length) {
        const findLvlTwo = childLvlOne.child_track_section.find((vv) => vv.id === section_id);

        if (!findLvlTwo) {
          for (const childLvlTwo of childLvlOne.child_track_section) {
            if (childLvlTwo.child_track_section && childLvlTwo.child_track_section.length) {
              const findLvlThree = childLvlTwo.child_track_section.find(
                (vvv) => vvv.id === section_id
              );

              if (!findLvlThree) {
                for (const childLvlThree of childLvlTwo.child_track_section) {
                  if (
                    childLvlThree.child_track_section &&
                    childLvlThree.child_track_section.length
                  ) {
                    const findLvlFour = childLvlThree.child_track_section.find(
                      (vvvv) => vvvv.id === section_id
                    );

                    if (findLvlFour) {
                      levelFour = findLvlFour;
                      levelThree = childLvlThree;
                      levelTwo = childLvlTwo;
                      levelOne = childLvlOne;
                    }
                  }
                }
              } else {
                levelThree = findLvlThree;
                levelTwo = childLvlTwo;
                levelOne = childLvlOne;
              }
            }
          }
        } else {
          levelOne = childLvlOne;
          levelTwo = findLvlTwo;
        }
      }
    }
  } else {
    levelOne = findLevelOne;
  }

  return { levelOne, levelTwo, levelThree, levelFour };
}

export function getSupervisorId(section_supervisor?: SectionSupervisor[]): ComboBoxOption[] {
  let SpvId: ComboBoxOption[] = [];
  if (section_supervisor) {
    SpvId =
      (section_supervisor &&
        section_supervisor.map((item) => ({
          label: item.supervisor.employee_name || '',
          value: item.supervisor_user_id,
        }))) ||
      [];
  }
  return SpvId;
}
