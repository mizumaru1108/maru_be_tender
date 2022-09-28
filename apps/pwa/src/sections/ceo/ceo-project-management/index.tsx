import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';

function CeoProjectManagement() {
  const headerCells: ProjectManagementTableHeader[] = [
    { id: 'projectNumber', label: 'Project Number' },
    { id: 'projectName', label: 'Project Name' },
    { id: 'associationName', label: 'Association Name', align: 'left' },
    { id: 'projectSection', label: 'Section', align: 'left' },
    { id: 'createdAt', label: 'Date Created', align: 'left' },
    { id: 'events', label: 'events', align: 'left' },
  ];

  const projectManagementData: ProjectManagement[] = [
    {
      id: '1231231',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Mosques Department',
      createdAt: new Date(),
    },
    {
      id: '1231232',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Facilitated Scholarship Track',
      createdAt: new Date(),
    },
    {
      id: '1231233',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Mosques Department',
      createdAt: new Date(),
    },
    {
      id: '1231234',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Initiatives track',
      createdAt: new Date(),
    },
    {
      id: '1231235',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'baptismal path',
      createdAt: new Date(),
    },
    {
      id: '1231236',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Mosques Department',
      createdAt: new Date(),
    },
    {
      id: '1231237',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: "Sheikh's path",
      createdAt: new Date(),
    },
    {
      id: '1231238',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Mosques Department',
      createdAt: new Date(),
    },
    {
      id: '1231239',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Facilitated Scholarship Track',
      createdAt: new Date(),
    },
    {
      id: '1231240',
      projectNumber: '#768873',
      projectName: 'Maintenance Project of the New Industrial Call Society Mosque in Riyadh',
      associationName: 'New Industrial Call Society in Riyadh',
      projectSection: 'Mosques Department',
      createdAt: new Date(),
    },
  ];
  return <ProjectManagementTable headerCell={headerCells} data={projectManagementData} />;
}

export default CeoProjectManagement;
