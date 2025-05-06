--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

-- Started on 2025-05-06 19:37:29 CEST

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

--
-- TOC entry 3491 (class 1262 OID 5)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

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

--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 3491
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16388)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customerid integer NOT NULL,
    firstname character varying(50),
    lastname character varying(50)
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24650)
-- Name: izvodjac_muzike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.izvodjac_muzike (
    dj_id integer NOT NULL,
    ime character varying(50) NOT NULL,
    prezime character varying(50) NOT NULL,
    oib character varying(20) NOT NULL,
    datum_rodjenja date NOT NULL,
    adresa character varying(100),
    profilna_slika character varying(255),
    iban character varying(34) NOT NULL,
    google_user_id character varying(255),
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    about_me text,
    instagram character varying
);


ALTER TABLE public.izvodjac_muzike OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24649)
-- Name: izvodjac_muzike_dj_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.izvodjac_muzike_dj_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.izvodjac_muzike_dj_id_seq OWNER TO postgres;

--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 216
-- Name: izvodjac_muzike_dj_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.izvodjac_muzike_dj_id_seq OWNED BY public.izvodjac_muzike.dj_id;


--
-- TOC entry 219 (class 1259 OID 24659)
-- Name: lokacija; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lokacija (
    lokacija_id integer NOT NULL,
    profil_slika_link character varying(255),
    facebook character varying(70),
    instagram character varying(70),
    twitter character varying(70),
    about_us text,
    adresa character varying(100),
    email character varying(100),
    broj_telefona character varying(20),
    naziv_kluba character varying
);


ALTER TABLE public.lokacija OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24658)
-- Name: lokacija_lokacija_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lokacija_lokacija_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lokacija_lokacija_id_seq OWNER TO postgres;

--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 218
-- Name: lokacija_lokacija_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lokacija_lokacija_id_seq OWNED BY public.lokacija.lokacija_id;


--
-- TOC entry 223 (class 1259 OID 24696)
-- Name: narudzba; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.narudzba (
    narudzba_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sesija_id integer,
    comment text,
    donation integer,
    song_id character varying(50) NOT NULL,
    song_name character varying(255) NOT NULL,
    song_artist character varying(255) NOT NULL,
    song_album_art character varying(255),
    status character varying(50) NOT NULL,
    stripe_payment_link character varying,
    user_id uuid NOT NULL,
    stripe_payment_intent_id character varying,
    CONSTRAINT narudzba_donation_check CHECK ((donation >= 0))
);


ALTER TABLE public.narudzba OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24695)
-- Name: narudzba_narudzba_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.narudzba_narudzba_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.narudzba_narudzba_id_seq OWNER TO postgres;

--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 222
-- Name: narudzba_narudzba_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.narudzba_narudzba_id_seq OWNED BY public.narudzba.narudzba_id;


--
-- TOC entry 221 (class 1259 OID 24675)
-- Name: sesija; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sesija (
    sesija_id integer NOT NULL,
    dj_id integer,
    lokacija_id integer,
    expiration timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '24:00:00'::interval),
    minimal_price integer NOT NULL,
    comentary text,
    queue_max_song_count integer,
    naziv character varying,
    CONSTRAINT sesija_minimal_price_check CHECK ((minimal_price >= 0))
);


ALTER TABLE public.sesija OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24674)
-- Name: sesija_sesija_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sesija_sesija_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sesija_sesija_id_seq OWNER TO postgres;

--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 220
-- Name: sesija_sesija_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sesija_sesija_id_seq OWNED BY public.sesija.sesija_id;


--
-- TOC entry 224 (class 1259 OID 32784)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id uuid NOT NULL,
    nickname character varying(255) NOT NULL,
    token uuid NOT NULL,
    "createdAt" timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 3308 (class 2604 OID 24653)
-- Name: izvodjac_muzike dj_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.izvodjac_muzike ALTER COLUMN dj_id SET DEFAULT nextval('public.izvodjac_muzike_dj_id_seq'::regclass);


--
-- TOC entry 3309 (class 2604 OID 24662)
-- Name: lokacija lokacija_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lokacija ALTER COLUMN lokacija_id SET DEFAULT nextval('public.lokacija_lokacija_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 24699)
-- Name: narudzba narudzba_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.narudzba ALTER COLUMN narudzba_id SET DEFAULT nextval('public.narudzba_narudzba_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 24678)
-- Name: sesija sesija_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesija ALTER COLUMN sesija_id SET DEFAULT nextval('public.sesija_sesija_id_seq'::regclass);


--
-- TOC entry 3476 (class 0 OID 16388)
-- Dependencies: 215
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3478 (class 0 OID 24650)
-- Dependencies: 217
-- Data for Name: izvodjac_muzike; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.izvodjac_muzike VALUES (1, 'Ivan', 'Horvat', '12345678901', '1990-01-15', 'Zagrebačka 12', NULL, 'HR1234567890123456789012', NULL, 'ivan@example.com', 'pass123', 'Ljubitelj elektronike.', NULL);
INSERT INTO public.izvodjac_muzike VALUES (2, 'Ana', 'Marić', '23456789012', '1987-04-20', 'Splitska 33', NULL, 'HR9876543210987654321098', NULL, 'ana@example.com', 'pass123', 'DJ s 10 godina iskustva.', NULL);
INSERT INTO public.izvodjac_muzike VALUES (4, 'Lana', 'Barić', '45678901234', '1992-03-22', 'Osječka 2', NULL, 'HR9988776655443322110099', NULL, 'lana@example.com', 'pass123', 'Funky house queen.', NULL);
INSERT INTO public.izvodjac_muzike VALUES (5, 'Tomislav', 'Novak', '56789012345', '1980-11-05', NULL, NULL, 'HR5566778899001122334455', NULL, 'tomislav@example.com', 'pass123', NULL, NULL);
INSERT INTO public.izvodjac_muzike VALUES (6, 'Sara', 'Radić', '67890123456', '1998-07-14', 'Karlovačka 44', NULL, 'HR6677889900112233445566', NULL, 'sara@example.com', 'pass123', 'Mlada nada techno scene.', NULL);
INSERT INTO public.izvodjac_muzike VALUES (7, 'Petar', 'Jurić', '78901234567', '1985-06-30', NULL, NULL, 'HR3344556677889900112233', NULL, 'petar@example.com', 'pass123', NULL, NULL);
INSERT INTO public.izvodjac_muzike VALUES (8, 'Martina', 'Šimić', '89012345678', '1991-09-12', NULL, NULL, 'HR2233445566778899001122', NULL, 'martina@example.com', 'pass123', NULL, NULL);
INSERT INTO public.izvodjac_muzike VALUES (9, 'Ivan', 'Župan', '90123456789', '1993-12-01', NULL, NULL, 'HR7788990011223344556677', NULL, 'ivan.z@example.com', 'pass123', NULL, NULL);
INSERT INTO public.izvodjac_muzike VALUES (10, 'Nikolina', 'Tomić', '01234567890', '1989-02-28', NULL, NULL, 'HR8899001122334455667788', NULL, 'nikolina@example.com', 'pass123', NULL, NULL);
INSERT INTO public.izvodjac_muzike VALUES (3, 'Marko', 'Kovač', '34567890123', '1995-08-10', NULL, 'https://i.imgur.com/JVjBdNY.jpeg', 'HR1122334455667788990011', NULL, 'marko@example.com', 'pass123', 'Iskusan igrač u house/balkan glazbi', '@macaroni333');


--
-- TOC entry 3480 (class 0 OID 24659)
-- Dependencies: 219
-- Data for Name: lokacija; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lokacija VALUES (2, NULL, 'fb.com/klub2', 'insta.com/klub2', NULL, 'Live glazba i zabava svaki vikend.', 'Ilica 55', 'kontakt@klub2.hr', '0922222222', NULL);
INSERT INTO public.lokacija VALUES (3, NULL, NULL, 'insta.com/klub3', NULL, NULL, 'Vukovarska 88', NULL, '0933333333', NULL);
INSERT INTO public.lokacija VALUES (4, NULL, 'fb.com/klub4', NULL, NULL, 'Old-school vibes.', 'Heinzelova 23', 'klub4@gmail.com', '0944444444', NULL);
INSERT INTO public.lokacija VALUES (5, NULL, NULL, NULL, NULL, 'Outdoor techno stage.', 'Riječka 10', 'stage@klub5.hr', '0955555555', NULL);
INSERT INTO public.lokacija VALUES (1, 'https://i.imgur.com/TzrnOIN.jpeg', 'fb.com/klub1', 'insta.com/klub1', NULL, 'Dobrodošli u Rave Beach Klub – Vaše savršenstvo na obali!

Smješten uz obalu Hrvatske, Rave Beach Klub je pravo mjesto za ljubitelje glazbe, zabave i nezaboravnih trenutaka. Uz nevjerojatnu lokaciju uz more, Rave Beach Klub nudi jedinstven spoj vrhunskih DJ nastupa, svjetlosnih show programa i fenomenalnih beach party-a.

Očekujte:

    Ekskluzivne nastupe DJ-a koji donose najnovije house, techno i EDM hitove

    Prekrasne plaže koje nude savršen ambijent za opuštanje uz valove

    Spektakularne sunčane zalaske koji stvaraju magičnu atmosferu

    Nezaboravnu zabavu uz pivo, koktele i najbolju klupsku atmosferu na otvorenom

Svaka noć u Rave Beach Klubu je posebna – od laganih beach vibe-a do energičnih partijanja pod zvijezdama. Naša misija je pružiti vam mjesto gdje se možete opustiti, plesati, uživati u dobrom društvu i stvarati uspomene za cijeli život.

Dolazak je uvijek dobra ideja, ali nikad nije kasno da postanete dio naše obitelji.

Spremite se za savršen spoj zvuka, svjetlosti, mora i sjajne atmosfere – samo u Rave Beach Klubu! 🌊🎶

Pratite nas na društvenim mrežama kako biste ostali u tijeku sa svim nadolazećim događanjima i popustima na ulaznice.', 'Savska 1', 'info@klub1.hr', '0911111111', 'RaveClub');


--
-- TOC entry 3484 (class 0 OID 24696)
-- Dependencies: 223
-- Data for Name: narudzba; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.narudzba VALUES (24, '2025-05-02 00:24:59.546', 3, 'kjhgv', 111, '5jWbqXPQvEkZB4K9aY8fZI', 'Evo Zore, Evo Dana', 'Drazen Zecic Zeko', 'https://i.scdn.co/image/ab67616d0000b2734fb54be2990d68da978a1aca', 'played', 'https://checkout.stripe.com/c/pay/cs_test_a1UTG7IDBbAuQa53Xtwhiz9XUI2oBRTuSISNsZfCYOm0yHj52Lro9KBUaI#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', 'pi_3RK7PTBtiTCoYo3A1prUaXLj');
INSERT INTO public.narudzba VALUES (19, '2025-05-01 20:59:39.264', 3, 'kjh', 120, '5bw67M95WUEw5pBI1wZM6N', 'Opet Si Pobijedila', 'Tony Cetinski', 'https://i.scdn.co/image/ab67616d0000b27384be1f75755c61bb64ee2612', 'played', 'https://checkout.stripe.com/c/pay/cs_test_a1bZcIwJIn9BFyix6oRsHgrKoKLk81qHY9lPgKtRmUamBRt2UcHewwR6sy#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (18, '2025-05-01 20:57:22.985', 3, 'dad', 93, '5E30LdtzQTGqRvNd7l6kG5', 'Daddy Issues', 'The Neighbourhood', 'https://i.scdn.co/image/ab67616d0000b2733066581d697fbdee4303d685', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1OiuakGNWWth4w7cy3Hsk5vLJ86Y7bsxE6lYRU07lxVp3pUt9wiYarB2z#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (25, '2025-05-02 00:27:02.821', 3, 'kjhgv', 186, '5jWbqXPQvEkZB4K9aY8fZI', 'Evo Zore, Evo Dana', 'Drazen Zecic Zeko', 'https://i.scdn.co/image/ab67616d0000b2734fb54be2990d68da978a1aca', 'played', 'https://checkout.stripe.com/c/pay/cs_test_a19Au4p5zFuM9aL4PbQKTVtY4LLEtuexFkGq72kOAEy8yREZE8jsyaCZkb#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', 'pi_3RK7RSBtiTCoYo3A1kg5StRI');
INSERT INTO public.narudzba VALUES (13, '2025-04-29 17:12:23.295', 3, 'test', 83, '1GxMhoR4AMwnjHe6oTKc1s', 'Pozdravi', 'Emir Đulović, Tanja Savic', 'https://i.scdn.co/image/ab67616d0000b27380721af29ff83600b58ebb05', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1c9ZxYD3dHx5w13HWkI0arSxdpUCufyDQ3OXxyzwSpPd84DqOytriw9Z7#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (15, '2025-04-30 16:21:50.083', 3, 'trening', 80, '5jlCN4Iqo5PiNNX7GpCVRd', 'Trezan', 'Sinan Sakic', 'https://i.scdn.co/image/ab67616d0000b27376bd75e8a3ec1c416a0bfdab', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a18sEpazzwYpAlHiAAdkjf0iabzAakUTPykyGkrz0iuHifT0s4zA38ksxY#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (1, '2025-04-15 18:22:19.655247', 1, 'Pusti ovu stvar, molim!', 10, '123abc', 'Sandstorm', 'Darude', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (2, '2025-04-15 18:22:19.655247', 1, 'Top stvar!', 5, '456def', 'One More Time', 'Daft Punk', NULL, 'approved', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (3, '2025-04-15 18:22:19.655247', 2, '', 0, '789ghi', 'Levels', 'Avicii', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (4, '2025-04-15 18:22:19.655247', 3, 'Za ekipu!', 15, '321jkl', 'Strobe', 'Deadmau5', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (5, '2025-04-15 18:22:19.655247', 4, '', 20, '654mno', 'Losing It', 'Fisher', NULL, 'approved', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (6, '2025-04-15 18:22:19.655247', 1, 'Super track.', 0, '987pqr', 'Animals', 'Martin Garrix', NULL, 'rejected', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (7, '2025-04-15 18:22:19.655247', 5, '', 0, '741stu', 'Titanium', 'David Guetta', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (8, '2025-04-15 18:22:19.655247', 2, '', 8, '852vwx', 'Don’t You Worry Child', 'SHM', NULL, 'approved', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (9, '2025-04-15 18:22:19.655247', 3, 'Stari hit!', 12, '963yz', 'Insomnia', 'Faithless', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (10, '2025-04-15 18:22:19.655247', 4, '', 0, '147abc', 'Greyhound', 'SHM', NULL, 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (11, '2025-04-29 16:55:40.868', 3, 'testni komentar', 30, 'test', 'songname', 'majkhl braun', 'test', 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (16, '2025-05-01 20:53:03.107', 3, 'test', 70, '2zWRPaZiWrHD62UNtQj94a', 'Okej', 'Brzo Trči Ljanmi', 'https://i.scdn.co/image/ab67616d0000b273fbdfffd93ad986a8c40c3616', 'pending', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (14, '2025-04-30 16:20:38.023', 3, 'trening', 165, '5jlCN4Iqo5PiNNX7GpCVRd', 'Trezan', 'Sinan Sakic', 'https://i.scdn.co/image/ab67616d0000b27376bd75e8a3ec1c416a0bfdab', 'rejected', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (20, '2025-05-01 21:01:38.045', 3, 'kjh', 120, '5bw67M95WUEw5pBI1wZM6N', 'Opet Si Pobijedila', 'Tony Cetinski', 'https://i.scdn.co/image/ab67616d0000b27384be1f75755c61bb64ee2612', 'rejected', NULL, '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (17, '2025-05-01 20:57:11.837', 3, 'test', 70, '2zWRPaZiWrHD62UNtQj94a', 'Okej', 'Brzo Trči Ljanmi', 'https://i.scdn.co/image/ab67616d0000b273fbdfffd93ad986a8c40c3616', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1dlqBBgxzEISuDHNa4Jj70qWPAw4YdV1wtkAbIqQl0pS0LeOF4ncPETw6#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '1821df2e-7e93-450b-a2b8-283b5d309a02', NULL);
INSERT INTO public.narudzba VALUES (23, '2025-05-02 00:02:23.422', 3, 'mk', 64, '4tun45MgoemIXpSbryIszE', 'Molim Te, Vrati Se', 'Sinisa Vuco', 'https://i.scdn.co/image/ab67616d0000b273bb01fc316b3744799315615a', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1TyjvcjCUB4pAQZ8w94Jg1hv5anreoevqRwcXvUGmL6YYJaN2O0HJ8XUq#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', NULL);
INSERT INTO public.narudzba VALUES (27, '2025-05-02 03:09:52.412', 3, NULL, 137, '6piNkjWXxR0Y81AdtEfQlK', 'FAZA', 'Miach', 'https://i.scdn.co/image/ab67616d0000b273a182526310d7c944c1c5ea61', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1iBIWHJkJx8dTx8fLDZiG8tTnozL5St1OEONHW345CuiHDb6lidCIFdt3#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', NULL);
INSERT INTO public.narudzba VALUES (28, '2025-05-02 03:17:34.656', 3, '', 172, '3bPgitkW5R2hCOgXduzPPW', 'Ljubavi Moja', 'Elitni Odredi, Dado Polumenta', 'https://i.scdn.co/image/ab67616d0000b273eafa7090491917b4aa59d9bd', 'allowed', 'https://checkout.stripe.com/c/pay/cs_test_a1L4SJID0t1RpKM4wW4THnIXM9XsLLy5WNXWzHrEmlUkaWuLYtxMdFbZ1c#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', 'pi_3RKA6SBtiTCoYo3A0uiglC3v');
INSERT INTO public.narudzba VALUES (26, '2025-05-02 00:28:37.155', 3, 'kjhgv', 186, '669FjKEzmsS8IafVPEJX7p', 'Evo Dajem Sve', 'Božja Pobjeda', 'https://i.scdn.co/image/ab67616d0000b27324c42b8527e0161cd9dfbfb3', 'played', 'https://checkout.stripe.com/c/pay/cs_test_a1IhjEzxywWdyTZBmMBzlbAmg7VE1FeYrQARkRRODbCFbSbqEqiIYBvmen#fidkdWxOYHwnPyd1blpxYHZxWjA0VzA2XDBHcWxRRmpcajZEUWlsSGk0fFIzUndqb2x8f2lHdGF1X25KPF9nVFc2Z05oaGR0U0h9QmJUSXU8SjxdYHBgRmp3XG1IN3RHQGxtcHcwUW51Uk1UNTVNNldgM0xzbCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', '8d8271fc-86d4-4da7-9994-452e0713b560', 'pi_3RK7SyBtiTCoYo3A1Mc7SZFE');


--
-- TOC entry 3482 (class 0 OID 24675)
-- Dependencies: 221
-- Data for Name: sesija; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sesija VALUES (1, 1, 1, '2025-04-16 18:21:57.242197', 10, 'Let’s party!', 20, NULL);
INSERT INTO public.sesija VALUES (2, 2, 2, '2025-04-16 18:21:57.242197', 20, 'Open mic night!', 15, NULL);
INSERT INTO public.sesija VALUES (4, 4, 3, '2025-04-16 18:21:57.242197', 5, NULL, 25, NULL);
INSERT INTO public.sesija VALUES (5, 5, 2, '2025-04-16 18:21:57.242197', 0, 'Free requests!', NULL, NULL);
INSERT INTO public.sesija VALUES (3, 3, 1, '2025-04-16 18:21:57.242197', 15, 'Techno set.', 30, 'Tehno party');


--
-- TOC entry 3485 (class 0 OID 32784)
-- Dependencies: 224
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" VALUES ('1e36d5c5-1461-4a25-be4c-0b2aad89a3d5', 'miro', 'ebf37a12-25b3-484d-a9c3-3b0757925fb5', '2025-05-02 01:32:25.514+02');
INSERT INTO public."user" VALUES ('b9da3b77-2e85-4f14-91b0-73b59b53ce51', 'miro', 'd17faa6c-0330-44d0-acb8-c3cd542ef366', '2025-05-02 01:32:39.868+02');
INSERT INTO public."user" VALUES ('1ac662de-78f5-4984-bead-2d7edfad85d1', 'miro', '4e2f510f-3560-4445-bb52-30ee04a3e9b0', '2025-05-02 01:32:51.608+02');
INSERT INTO public."user" VALUES ('d5e10b31-a48b-4d0e-b92f-e3102354d5e2', '', 'fc53cbdb-132b-4fe4-a6e5-8c5ffaf2ceba', '2025-05-02 01:32:52.5+02');
INSERT INTO public."user" VALUES ('65cacd7a-e29d-47bd-8cff-0409725ef832', '', 'b99c527a-0c4e-4304-a0cb-a38ab6e6c5ee', '2025-05-02 01:32:53.344+02');
INSERT INTO public."user" VALUES ('abe202fb-6ec6-44df-91ed-863058abd2f3', '', '9e47eec5-a16d-45fc-9c96-a3e08f7d8300', '2025-05-02 01:32:54.006+02');
INSERT INTO public."user" VALUES ('8d8271fc-86d4-4da7-9994-452e0713b560', 'miro', '69c3af38-f19d-4385-9f16-682fe6a2541a', '2025-05-02 01:34:42.342+02');
INSERT INTO public."user" VALUES ('2d7ffd02-82e3-4b2e-a3ea-dbed729a2bd2', 'direktor', '959d9371-5536-4e3b-9c94-a362665b4307', '2025-05-06 17:19:09.677+02');


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 216
-- Name: izvodjac_muzike_dj_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.izvodjac_muzike_dj_id_seq', 10, true);


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 218
-- Name: lokacija_lokacija_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lokacija_lokacija_id_seq', 5, true);


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 222
-- Name: narudzba_narudzba_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.narudzba_narudzba_id_seq', 28, true);


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 220
-- Name: sesija_sesija_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sesija_sesija_id_seq', 5, true);


--
-- TOC entry 3317 (class 2606 OID 16392)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customerid);


--
-- TOC entry 3319 (class 2606 OID 24657)
-- Name: izvodjac_muzike izvodjac_muzike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.izvodjac_muzike
    ADD CONSTRAINT izvodjac_muzike_pkey PRIMARY KEY (dj_id);


--
-- TOC entry 3321 (class 2606 OID 24666)
-- Name: lokacija lokacija_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lokacija
    ADD CONSTRAINT lokacija_pkey PRIMARY KEY (lokacija_id);


--
-- TOC entry 3325 (class 2606 OID 24705)
-- Name: narudzba narudzba_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.narudzba
    ADD CONSTRAINT narudzba_pkey PRIMARY KEY (narudzba_id);


--
-- TOC entry 3323 (class 2606 OID 24684)
-- Name: sesija sesija_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesija
    ADD CONSTRAINT sesija_pkey PRIMARY KEY (sesija_id);


--
-- TOC entry 3327 (class 2606 OID 32788)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3329 (class 2606 OID 32790)
-- Name: user user_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_token_key UNIQUE (token);


--
-- TOC entry 3332 (class 2606 OID 24706)
-- Name: narudzba narudzba_sesija_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.narudzba
    ADD CONSTRAINT narudzba_sesija_id_fkey FOREIGN KEY (sesija_id) REFERENCES public.sesija(sesija_id);


--
-- TOC entry 3330 (class 2606 OID 24685)
-- Name: sesija sesija_dj_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesija
    ADD CONSTRAINT sesija_dj_id_fkey FOREIGN KEY (dj_id) REFERENCES public.izvodjac_muzike(dj_id);


--
-- TOC entry 3331 (class 2606 OID 24690)
-- Name: sesija sesija_lokacija_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesija
    ADD CONSTRAINT sesija_lokacija_id_fkey FOREIGN KEY (lokacija_id) REFERENCES public.lokacija(lokacija_id);


-- Completed on 2025-05-06 19:37:29 CEST

--
-- PostgreSQL database dump complete
--

