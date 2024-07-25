export type ProductListProps = {
    pid: string,
    pname: string,
    pimageurl: string,
    dealtype?: string,
    tag?: string,
    price: string,
    discount?: string,
    coupon?: string,
    pshortdetails: string,
    productdetails: string,
    ptimestamp?: string,
    producturl: string,
    documentId: string,
    dealstatus?: string
    preprice: string,
    pcategory: string,
    preview: string,
    ptimeframe: string
    urlstring: string
};

export type BannerListProps = {
    bannerurl: string,
    bid: string,
    bimage: string,
    bimageurl: string,
    bname: string,
    bstatus: string,
    btimestamp: string,
    documentId?: string,
}

export type ProductCategory = {
    category_label: string,
    category_name: string,
    category_value: string
}