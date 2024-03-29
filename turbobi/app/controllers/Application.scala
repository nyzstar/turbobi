package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.db._
import com.github.tototoshi.csv._

import anorm._

import views._
import models._

import java.io.File

/**
 * Manage a database of computers
 */
object Application extends Controller { 
  
  /**
   * This result directly redirect to the application home.
   */
  val Home = Redirect(routes.Application.list(0, 2, ""))
  
  /**
   * Describe the computer form (used in both edit and create screens).
   */ 
  val computerForm = Form(
    mapping(
      "id" -> ignored(NotAssigned:Pk[Long]),
      "name" -> nonEmptyText,
      "introduced" -> optional(date("yyyy-MM-dd")),
      "discontinued" -> optional(date("yyyy-MM-dd")),
      "company" -> optional(longNumber)
    )(Computer.apply)(Computer.unapply)
  )
  
  // -- Actions

  /**
   * Handle default path requests, redirect to computers list
   */  
  def index = Action { Home }
  
  /**
   * Display the paginated list of computers.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on computer names
   */
  def list(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.list(
      Computer.list(page = page, orderBy = orderBy, filter = ("%"+filter+"%")),
      orderBy, filter
    ))
  }
  
  /**
   * Display the 'edit form' of a existing Computer.
   *
   * @param id Id of the computer to edit
   */
  def edit(id: Long) = Action {
    Computer.findById(id).map { computer =>
      Ok(html.editForm(id, computerForm.fill(computer), Company.options))
    }.getOrElse(NotFound)
  }
  
  /**
   * Handle the 'edit form' submission 
   *
   * @param id Id of the computer to edit
   */
  def update(id: Long) = Action { implicit request =>
    computerForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.editForm(id, formWithErrors, Company.options)),
      computer => {
        Computer.update(id, computer)
        Home.flashing("success" -> "Computer %s has been updated".format(computer.name))
      }
    )
  }
  
  /**
   * Display the 'new computer form'.
   */
  def create = Action {
    Ok(html.createForm(computerForm, Company.options))
  }
  
  /**
   * Handle the 'new computer form' submission.
   */
  def save = Action { implicit request =>
    computerForm.bindFromRequest.fold(
      formWithErrors => BadRequest(html.createForm(formWithErrors, Company.options)),
      computer => {
        Computer.insert(computer)
        Home.flashing("success" -> "Computer %s has been created".format(computer.name))
      }
    )
  }
  
  /**
   * Handle computer deletion.
   */
  def delete(id: Long) = Action {
    Computer.delete(id)
    Home.flashing("success" -> "Computer has been deleted")
  }

  /**
  * Handle CSV upload.
  */
  def upload = Action(parse.multipartFormData) { request =>
    request.body.file("csvfile").map { csvfile =>
      
      val filename = csvfile.filename
      val contentType = csvfile.contentType
      csvfile.ref.moveTo(new File(s"/tmp/picture/$filename"), true)
      //Logger.debug(s"The file is $filename")
      processCSV(filename)
      Ok("File uploaded")

    }.getOrElse {
      Redirect(routes.Application.index).flashing(
        "error" -> "Missing file")
    }
  }

  def processCSV(filename: String) = {
      import com.github.tototoshi.csv._

      val reader = CSVReader.open(new File(s"/tmp/picture/$filename"))
      val it = reader.iterator

      val fields = it.next

      val newFields = fields.map(field => field.replace(' ', '_').replace('\'','_').replace("(","_").replace(")",""))
      
      Logger.debug(newFields.mkString(" ")) 
      
      TableUtilities.createTable("utable_" + filename.replace(".","_"), newFields)

      while(it.hasNext){
        val values = it.next;
        val data = values.map(value => "\""+value+"\"")
        Logger.debug(data.mkString(","))
        TableUtilities.insertUserData("utable_" + filename.replace(".","_"), data)
      }
      reader.close
  } 
}
            
