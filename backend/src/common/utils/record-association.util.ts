// import { create } from 'domain';
// import { groupBy } from 'lodash';
// import { ModuleNamesToConnectParam } from 'src/packages/modules/enums/modules.enum';

// export interface IRecordAssociation {
//   api_name: string;
//   record_id: string;
// }

// export const getFormattedRecordAssociations = (
//   recordAssociations: IRecordAssociation[],
//   orgId: string,
// ) => {
//   let formattedAssociations = {};
//   const associationGroup = groupBy(recordAssociations, 'api_name');
//   for (const associationApiName of Object.keys(associationGroup)) {
//     formattedAssociations[associationApiName] = { create: [] };
//     formattedAssociations[associationApiName]['create'] = associationGroup[
//       associationApiName
//     ].map((association) => {
//       let obj = {};
//       obj['org'] = { connect: { id: orgId } };
//       obj[ModuleNamesToConnectParam[associationApiName]] = {
//         connect: { id: association.record_id },
//       };
//       return obj;
//     });
//   }
//   return formattedAssociations;
// };
