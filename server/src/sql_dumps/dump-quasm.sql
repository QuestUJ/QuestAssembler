--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-14 02:12:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 33311)
-- Name: Characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Characters" (
    id character varying(36) NOT NULL,
    nick character varying(256) NOT NULL,
    description character varying,
    "roomID" character varying(36) NOT NULL,
    "isGameMaster" boolean NOT NULL,
    "userID" character varying(36) NOT NULL,
    "profileIMG" character varying(255),
    "submitContent" character varying,
    "submitTimestamp" timestamp without time zone DEFAULT now()
);


--
-- TOC entry 222 (class 1259 OID 33325)
-- Name: ChatMessages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChatMessages" (
    "messageID" integer NOT NULL,
    "from" character varying(36) NOT NULL,
    "to" character varying(36) NOT NULL,
    content character varying NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 33324)
-- Name: ChatMessages_messageID_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ChatMessages_messageID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 221
-- Name: ChatMessages_messageID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ChatMessages_messageID_seq" OWNED BY public."ChatMessages"."messageID";


--
-- TOC entry 217 (class 1259 OID 33291)
-- Name: Rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Rooms" (
    id character varying(36) NOT NULL,
    "roomName" character varying(256) NOT NULL,
    "maxPlayerCount" integer NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 33297)
-- Name: StoryChunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StoryChunks" (
    "chunkID" integer NOT NULL,
    "roomID" character varying(36) NOT NULL,
    title character varying(256) NOT NULL,
    content character varying NOT NULL,
    "imageURL" character varying,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 33296)
-- Name: StoryChunks_chunkID_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."StoryChunks_chunkID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 218
-- Name: StoryChunks_chunkID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."StoryChunks_chunkID_seq" OWNED BY public."StoryChunks"."chunkID";


--
-- TOC entry 3221 (class 2604 OID 33328)
-- Name: ChatMessages messageID; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChatMessages" ALTER COLUMN "messageID" SET DEFAULT nextval('public."ChatMessages_messageID_seq"'::regclass);


--
-- TOC entry 3218 (class 2604 OID 33300)
-- Name: StoryChunks chunkID; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryChunks" ALTER COLUMN "chunkID" SET DEFAULT nextval('public."StoryChunks_chunkID_seq"'::regclass);


--
-- TOC entry 3228 (class 2606 OID 33318)
-- Name: Characters Characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Characters"
    ADD CONSTRAINT "Characters_pkey" PRIMARY KEY (id);


--
-- TOC entry 3230 (class 2606 OID 33333)
-- Name: ChatMessages ChatMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChatMessages"
    ADD CONSTRAINT "ChatMessages_pkey" PRIMARY KEY ("messageID");


--
-- TOC entry 3224 (class 2606 OID 33295)
-- Name: Rooms Rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Rooms"
    ADD CONSTRAINT "Rooms_pkey" PRIMARY KEY (id);


--
-- TOC entry 3226 (class 2606 OID 33305)
-- Name: StoryChunks StoryChunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryChunks"
    ADD CONSTRAINT "StoryChunks_pkey" PRIMARY KEY ("chunkID");


--
-- TOC entry 3232 (class 2606 OID 33319)
-- Name: Characters Characters_roomID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Characters"
    ADD CONSTRAINT "Characters_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES public."Rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3233 (class 2606 OID 33334)
-- Name: ChatMessages ChatMessages_from_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChatMessages"
    ADD CONSTRAINT "ChatMessages_from_fkey" FOREIGN KEY ("from") REFERENCES public."Characters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3234 (class 2606 OID 33339)
-- Name: ChatMessages ChatMessages_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChatMessages"
    ADD CONSTRAINT "ChatMessages_to_fkey" FOREIGN KEY ("to") REFERENCES public."Characters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3231 (class 2606 OID 33306)
-- Name: StoryChunks StoryChunks_roomID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StoryChunks"
    ADD CONSTRAINT "StoryChunks_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES public."Rooms"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2024-05-14 02:13:10

--
-- PostgreSQL database dump complete
--

