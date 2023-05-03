/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }
  //setter and getter for numGuests
  set numGuests(val){
    if (numGuests < 1){
      throw new Error("Cannot have fewer than 1 guest")
    }else{
      this._numGuests = val;
    }
  }
  get numGuests(){
    return this._numGuests;
  }
  //setter and getter for startAt
  set startAt(value) {
    if (!(value instanceof Date)) {
      this._startAt = val; 
    }else{
      throw new Error('startAt must be a Date object');   
    }
    
  }
  get startAt(){
    return this._startAt 
  }

  //setter and getter for customerId
  set customerId(val){
    if (customerId && customerId !== val){
      throw new Error("customerId is existed and cannot be changes");
    }
    this._customerId = val;
  }
  get customerId(){
    return this._customerId;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
  async save(){
    if (this.id === undefined){
      const result = await db.query(
        `INSERT INTO reservations (customer_id, num_guests, start_at, notes) 
         VALUES customer_id = $1, num_guests = $2, start_at = $3, notes = $4 RETURNING 
         id, customer_id, num_guests, start_at, notes`, [this.customerId, this.numGuests, this.startAt, this.notes]
      );
      this.id = result.rows[0].id;
    }else{
      await db.query(
        `UPDATE reservations SET customer_id = $1, num_guests = $2, start_at = $3, notes = $4 RETURNING 
        id, customer_id, num_guests, start_at, notes`, [this.customerId, this.numGuests, this.startAt, this.notes]
      );  
    }
  }


}



module.exports = Reservation;
