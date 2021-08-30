import { PrismaClient, events } from '@prisma/client'
import express from 'express'
import {create} from "domain";

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get(`/events.json`, async (req, res) => {
    const limit = Number(req.query.limit || "50")
    if (limit > 250) {
        return res.status(400).send()
    }

    const since_id = req.query.since_id
    const since_id_where = since_id === undefined ? {} : {
        subject_id: {
            gt: Number(since_id)
        }
    }

    // TODO: `created_at_min` `created_at_max` but they are stored as strings

    const verb = req.query.verb as string
    const verb_where = verb === undefined ? {} : {
        verb: verb
    }

    const filter = (req.query.filter as string)?.split(",")
    const filter_where = filter === undefined ? {} : {
        subject_type: {
            in: filter
        }
    }

    const where = {
        ...since_id_where,
        ...verb_where,
        ...filter_where
    }

    const fields = (req.query.fields as string)?.split(",")
        .map(field => [field, true])
    const select = fields === undefined ? undefined : Object.fromEntries(fields)

    let result: { ObjectId?: string }[] = await prisma.events.findMany({
        where,
        take: limit,
        select
    })

    result.forEach((event) => {
        delete event.ObjectId
    })

    res.json({
        events: result
    })
})

const server = app.listen(3000, () =>
    console.log("Listening at http://localhost:3000")
)