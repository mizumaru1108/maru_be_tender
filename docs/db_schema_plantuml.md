```bash
' avoid problems with angled crows feet
' skinparam linetype ortho





entity "projectOperatorMap" as projectOperatorMap{
  *_id: ObjectId
  *projectId: ObjectId
  *operatorId: ObjectId
  --
  createdAt: date
  updatedAt : date
}



entity "nearByPlace" as nearByPlace{
  *_id : ObjectId
  --
  name : string
  description : string
  address : string
  placeType : string
  distance : string
  createdAt : date
  updatedAt : date
  isDeleted : string
  isPublished : string
}

entity "campaignOperatorLog" as campaignOperatorLog{
 *_id : ObjectId
 *campaignId : ObjectId
 *vendorId : ObjectId
 --
 status : string
 createdAt : date
 updatedAt : date
}

package "Actor" {
entity "user" as user{
  *_id : string (uuid)
  --
  email : string
  firstName : string
  lastName : string
  profilePicture : string
  type : string
}



entity "donor" as donor{
  *_id : ObjectId
  *organizationId : ObjectId
  ownerUserId : string (uuid)
  --
  about : string
  address : string
  country : string
  email : string
  facebook : string
  twitter : string
  firstName : string
  lastname : string
  gender : string
  defaultCurrency : string
  ownerRealmId : string
  profilePic : string
  createdAt : date
  updatedAt : date
  isDeleted : string
  isPublished : string
}

entity "vendor" as vendor{
 *_id : ObjectId
 *ownerUserId : string
 --
 name : string
 location : string
 channels : string
 coverImage : string
 image1 : string
 image2 : string
 image3 : string
 ability : string
 freeTime : string
 document : string
 createdAt : date
 updatedAt : date
 isDeleted : string
 isPublished : string
 vendorAvatar : string
}

entity "operator" as operator{
  *_id : ObjectId
  *organizationId : ObjectId
  --
  name : string
  email : string
  levelAccess : string
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  description : string
  createdAt : date
  updatedAt : date
  isActive : string
  isDeleted : string
  ownerUserId : string
  operatorAvatar : string
}
}
entity "paymentLog" as paymentLog{
  *_id : ObjectId
  *vendorId : ObjectId
  --
  type : string
  amount : string
  paymentDate : date
  createdAt : date
  updatedAt : date
}



entity "campaignVendorLog" as campaignVendorLog{
  *_id : ObjectId
  *campaignId : ObjectId
  *vendorId : ObjectId
  --
  status : string
  createdAt : date
  updatedAt : date
}

entity "milestone" as milestone{
  *_id : ObjectId
  *campaignId : ObjectId
  --
  name : string
  deadline : string
  description : string
  createdAt : date
  updatedAt : date
  isDeleted : string
  isPublished : string
}

entity "campaignMilestoneLog" as campaignMilestoneLog{
 *_id : ObjectId
 *campaignId : ObjectId
 --
 milestoneId : ObjectId
 createdAt : date
 updatedAt : date
}



entity "invoiceLog" as invoiceLog{
  *_id : ObjectId
  *milestoneId : ObjectId
  --
  itemName : string
  fees : string
  document : string
  createdAt : date
  updatedAt : date
}

entity "task" as task{
  *_id : ObjectId
  *campaigntId : ObjectId
  --
  name : string
  startDate : date
  endDate : date
  seatNum : decimal128
  job : string
  enrollmentType : string
  gender : string
  reasonToPay : string
  isRemote : string
  isUrgent : string
  isDisaAvailable : string
  needsInterview : string
  taskDetails : string
  requiredSkills : string
  requiredProfession : string
  supportProvider : string
  requiredAge : string
  benefitDetails : string
  coverImage : string
  image1 : string
  image2 : string
  createdAt : date
  updatedAt : date
  isDeleted : string
  isPublished : string
}

package "Content" {

entity "article" as article{
  *_id : ObjectId
  *organizationId : ObjectId
  *operatorId : ObjectId
  --
  title : string
  content : string
  category : string
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  viewCount : string
  isDeleted : string
  isPublished : string
  createdAt : date
  updatedAt : date
}

entity "blog" as blog{
  *_id : ObjectId
  *organizationId : ObjectId
  *donorId : ObjectId
  --
  title : string
  content : string
  category : string
  description : string
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  viewCount : decimal128
  createdAt : date
  updatedAt : date
  isDeleted : string
  isActive : string
}

}
entity "ticket" as ticket{
  *_id : ObjectId
  --
  title : string
  department : string
  userCreatedType : string
  userCreatedId : string
  description : string
  createdAt : date
  updatedAt : date
}


entity "ticketLog" as ticketLog{
  *_id : ObjectId
  *ticketId : ObjectId
  --
  status : string
  resolvedBy : string
  createdAt : date
  updatedAt : date
}

entity "volunteer" as volunteer{
  *_id : ObjectId
  --
  name : string
  location : string
  channels : string
  ability : string
  freeTime : string
  document : string
  createdAt : date
  updatedAt : date
  isDeleted : string
  isPublished : string
}


entity "volunteerTaskLog" as volunteerTaskLog{
  *_id : ObjectId
  *taskId : ObjectId
  *volunteerId : ObjectId
  --
  status : string
  createdAt : date
  updatedAt : date
}


package "Fundraising" {

entity "organization" as organization{
    *_id : ObjectId
    --
    organizationEmail : string
    ownerRealmId : ObjectId
    organizationBankAccount : string
    organizationModerator : string
    organizationSwiftCode : string
    OrganizationBankAccountName : string
    ownerUserId : string (uuid)
    organizationType : string
    username : string
    organizationSize : decimal128
    organizationProfile : string
    organizationName : string
    name : string
    impact1Amount : string
    impact1Title : string
    impact2Amount : string
    impact2Title : string
    impact3Amount : string
    impact3Title : string
    defaultCurrency : string
    contactEmail : string
    contactPhone : string
    contactWhatsapp : string
    xenditMode : string
    aboutBody : string
    aboutHeading : string
    aboutPicture : string
    paypalClientId : string
    facebook : string
    instagram : string
    featured : string
    favicon : string
    featuredPos : decimal128
    address : string
    city : string
    country : string
    state : string
    zipCode : string
}

entity "project" as project{
  *_id : ObjectId
  *_organizationId : ObjectId
  --
  name : string
  address : string
  description : string
  amountProgress : decimal128
  amountTarget : decimal128
  location : string
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  nearByPlaceId : string
  diameterSize : string
  prayersSize : string
  toiletsSize : string
  hasAc : string
  hasClassroom : string
  hasParking : string
  hasGreenSpace : string
  hasFemaleSection : string
  createdAt : date
  updatedAt : date
  ipAddress : string
  isDeleted : string
  isPublished : string
  projectAvatar : string
}

entity "item" as item{
  *_id : ObjectId
  *projectId : ObjectId
  --
  name : string
  category : string
  defaultPrice : string
  totalNeed : string
  description : string
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  isDeleted : string
  isPublished : string
  createdAt : date
  updatedAt : date
}


entity "campaign" as campaign{
  *_id : ObjectId
  *_organizationId : ObjectId
  --
  name : string
  projectId : ObjectId
  campaignType : string
  description : string
  isFinished : string
  isMoney : string
  creatorUserId : uuid
  updaterUserId : uuid
  methods : string
  currencyCode : string
  amountProgress : decimal128
  amountTarget : decimal128
  coverImage : string
  image1 : string
  image2 : string
  image3 : string
  createdAt : string
  updatedAt : string
  isDeleted : string
  isPublished : string
}

package "Financial Service" {
entity "donationLog" as donationLog{
  *_id : ObjectId
  *organizationId : ObjectId
  *projectId : ObjectId
  *campaignId : ObjectId
  *donorId : ObjectId
  *itemId : ObjectId
  --
  type : string
  donationStatus : string
  paymentGatewayId : string
  amount : decimal128
  currency : string
  transactionId : string
  ipAddress : string
  createdAt : date
  updatedAt : date
}

entity "paymentGateway" as paymentGateway{
  *_id : ObjectId
  *organizationId: ObjectId
  --
  name : string
  defaultCurrency : string
  isActive : string
  profileId : string
  apiKey : string
  isDeleted : string
  createdAt : date
  updatedAt : date

}
}
}
user ||..o{ donor
user ||..o{ operator
user ||..o{ vendor
organization ||..o{ project
organization ||..o{ paymentGateway
project ||..o{ campaign
project ||..o{ item
project ||..o{ nearByPlace
project ||..o{ projectOperatorMap
project ||..o{ donationLog
item ||..o{ donationLog
operator ||..o{ article
operator ||..o{ projectOperatorMap
donor ||..o{ blog
user ||..o{ ticket
ticket ||..o{ ticketLog
campaign ||..o{ campaignMilestoneLog
milestone ||..o{ campaignMilestoneLog
milestone ||..o{ invoiceLog
campaign ||..o{ task
campaign ||..o{ donationLog
campaign ||..o{ campaignVendorLog
vendor ||..o{ campaignVendorLog
vendor ||..o{ paymentLog
task ||..o{ volunteerTaskLog
volunteer ||..o{ volunteerTaskLog
paymentGateway ||..o{ donationLog

@enduml
```
