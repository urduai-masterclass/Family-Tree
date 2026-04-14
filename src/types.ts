export interface FamilyMember {
  id: string;
  name: string;
  relation?: string;
  parentId?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface FamilyTreeData extends FamilyMember {
  children?: FamilyTreeData[];
}
