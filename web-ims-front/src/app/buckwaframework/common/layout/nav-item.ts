export interface NavItem {
    lvl: number,
    menuCode: string,
    menuId: string,
    menuName: string,
    menuVoList: NavItem[],
    parentId: string,
    rootId: string,
    sortingOrder: string,
    url: string
}