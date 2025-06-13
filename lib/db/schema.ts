import 'dotenv/config';
import {pgTable,text,uuid,integer,boolean,timestamp} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const files = pgTable("files",{
    id:uuid("id").defaultRandom().primaryKey(),

    //basic files and folder information

    name: text("name").notNull(),
    path: text('path').notNull(), // /document/project/resume
    size: integer("size").notNull(),
    type: text("type").notNull(),

    //storage information
    fileUrl: text("file_url").notNull(),  //url to access
    thumbnailUrl: text("thumbnail_url"),

    //ownership url 
    userId: text("user_id").notNull(),
    parentId: text('parent_id'), //parent folder id (null for root item)

    //file/folder flags
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarted: boolean("is_stared").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),


    //timestamped
    createdAt :timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

})

export const filesRelations = relations(files, ({one,many}) =>(
        {
            //parent  eeach folder can have many child files/folder
            parent:one(files, {
                fields: [files.parentId],
                references: [files.id],
            }),


            //relationship to child file/folder
            children: many(files)
        }))
    
// type defination
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert