export enum CampaignStatus {
  /**
   * Campaign doesn't have vendor yet (no vendorId)
   */
  NEW = 'new',

  /**
   * Campaign has vendorId but not yet approved by admin
   */
  PENDING_NEW = 'pending new',

  /**
   * (deprecated) Campaign has vendorId and approved by admin [v1].
   */
  PENDING = 'pending',

  /**
   * Campaign has been processed but get rejected by admin
   */
  PROCESSED = 'processed',

  /**
   * Campaign has been approved by admin
   */
  APPROVED = 'approved',
}
