import play.Project._

name := "TurboBI"

version := "1.0"

libraryDependencies ++= Seq(jdbc, anorm)

libraryDependencies += "com.github.tototoshi" %% "scala-csv" % "1.0.0"

playScalaSettings
