import { TrackSection } from '../@types/commons';

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
