import { PrismaClient, events } from '@prisma/client'
import express from 'express'
import {create} from "domain";

const selectQuery = (fields?: string) => {
    const entries = fields?.split(",")
        .map(field => [field, true])
    return entries === undefined ? undefined : Object.fromEntries(entries)
}

const prisma = new PrismaClient()
const app = express()
const router = express.Router()
router.use(express.json())

router.get(`/events/:event_id.json`, async (req, res) => {
    const select = selectQuery(req.query.fields as string)

    let result = await prisma.events.findUnique({
        where: {
            id: Number(req.params.event_id)
        },
        select,
    })

    if (result === null) {
        res.status(404).send()
    } else {
        res.json({
            event: result
        })
    }
})

router.get(`/events.json`, async (req, res) => {
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

    const select = selectQuery(req.query.fields as string)

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

const server = app.use("/admin/api/2021-07", router).listen(3000, () =>
    console.log("Listening at http://localhost:3000")
)